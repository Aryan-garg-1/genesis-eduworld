(function () {
  var C = window.GE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (C.REVIEW_FLAGS) document.documentElement.classList.add("show-flags");

  // Header shadow + gentle reveal
  var hdr = $(".site-header");
  var onScroll = function () { hdr && hdr.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    $$(".card,.stat,.focus-tile,.dm-grid,.band,.split,.timeline li").forEach(function (el) { el.classList.add("rv"); io.observe(el); });
  }

  // Mobile menu
  var btn = $(".menu-btn"), nav = $("#site-nav");
  if (btn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.querySelector(".lbl").textContent = open ? "Close" : "Menu";
    };
    btn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); btn.focus(); }
    });
  }

  // WhatsApp links: only shown once a number is confirmed in config.js
  var wa = (C.whatsapp || "").replace(/\D/g, "");
  $$("[data-whatsapp]").forEach(function (el) {
    if (wa.length >= 10) {
      el.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(C.whatsappMessage || "");
      el.target = "_blank"; el.rel = "noopener";
      el.removeAttribute("hidden");
      document.documentElement.classList.add("wa-on");
    } else { el.hidden = true; }
  });
  // Hide mobile-bar column count issues when WhatsApp is hidden handled by grid-auto-flow.

  // Pre-select form values from URL (?as=parent&program=Public+Speaking)
  var form = $("#enquiry-form");
  if (form) {
    var q = new URLSearchParams(location.search);
    var as = q.get("as"), prog = q.get("program");
    if (as && form.as) form.as.value = as;
    if (prog && form.program) {
      var found = false;
      $$("option", form.program).forEach(function (o) { if (o.value === prog) { o.selected = true; found = true; } });
      if (!found) form.program.value = "";
    }

    var status = $("#form-status");
    var setErr = function (name, msg) {
      var f = form.elements[name].closest(".field");
      f.classList.toggle("invalid", !!msg);
      $(".err", f).textContent = msg || "";
      form.elements[name].setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };
    var show = function (cls, title, html) {
      status.className = "status show " + cls;
      status.innerHTML = "<h3>" + title + "</h3>" + html;
      status.setAttribute("tabindex", "-1");
      status.focus();
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"].value.trim(), phone = form.elements.phone.value.trim(), email = form.elements.email.value.trim();
      var ok = true, first = null;
      var chk = function (n, m) { var r = setErr(n, m); if (!r && !first) first = form.elements[n]; ok = ok && r; };
      chk("name", name ? "" : "Please enter your name.");
      var digits = phone.replace(/\D/g, "");
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      chk("phone", !phone && !email ? "Please enter a phone number or an email address."
        : phone && (digits.length < 10 || digits.length > 13) ? "Enter a valid phone number (10 digits, or with +91)." : "");
      chk("email", email && !emailOk ? "Enter a valid email address, or leave it blank if you gave a phone number." : "");
      chk("as", form.as.value ? "" : "Please choose who is enquiring.");
      chk("consent", form.consent.checked ? "" : "Please tick the box so we know we may contact you.");
      if (!ok) { first.focus(); status.className = "status"; return; }

      var data = {
        name: name, phone: phone, email: email, enquiring_as: form.as.selectedOptions[0].text,
        program: form.program.value || "Not specified", message: form.message.value.trim() || "(no message)", consent: "Yes",
        _subject: "New website enquiry from " + name + " (" + form.as.selectedOptions[0].text + ")",
        _template: "table", _captcha: "false", _honey: form.elements["_honey"] ? form.elements["_honey"].value : ""
      };
      if (data._honey) { return; } // spam bot filled the hidden field

      var mailHref = function () {
        var body = "Name: " + data.name + "\nPhone: " + data.phone + "\nEmail: " + data.email +
          "\nEnquiring as: " + data.enquiring_as + "\nProgram/service: " + data.program +
          "\n\nMessage:\n" + data.message;
        return "mailto:" + C.email + "?subject=" + encodeURIComponent("Website enquiry from " + name) + "&body=" + encodeURIComponent(body);
      };
      var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

      if (C.formEndpoint) {
        var sub = $("button[type=submit]", form); sub.disabled = true; sub.textContent = "Sending…";
        var ctrl = ("AbortController" in window) ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;
        fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data), signal: ctrl ? ctrl.signal : undefined })
          .then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; });
          })
          .then(function (res) {
            var j = res.j || {};
            if (!res.ok || j.success === false || j.success === "false") {
              var err = new Error(j.message || "The form service did not accept the enquiry.");
              err.fromService = true; throw err;
            }
            form.reset();
            show("ok", "Thank you, " + esc(name) + ". Your enquiry has been sent.",
              "<p>The Genesis Eduworld team will use the details you gave to get in touch. If it is urgent, you can also call <a href=\"tel:" + C.phone + "\">" + C.phoneDisplay + "</a>.</p>");
          })
          .catch(function (err) {
            if (window.console) console.error("Enquiry form error:", err);
            var why = err && err.fromService ? "<p><small>Reason from the form service: " + esc(err.message) + "</small></p>" : "";
            show("bad", "We could not send your enquiry automatically",
              why + "<p>Nothing has been sent yet. You can send the same details by email in one tap:</p>" +
              "<p><a class=\"btn btn-primary\" href=\"" + mailHref() + "\">Send by email</a></p>" +
              "<p>Or call <a href=\"tel:" + C.phone + "\">" + C.phoneDisplay + "</a>.</p>");
          })
          .then(function () { if (timer) clearTimeout(timer); sub.disabled = false; sub.textContent = "Send enquiry"; });
      } else {
        // No delivery method configured: be honest, offer a prefilled email.
        var href = mailHref();
        show("warn", "Your enquiry has not been sent yet",
          "<p>Online sending is not switched on for this site yet, so nothing has gone to Genesis Eduworld. Your details are ready to send in one tap:</p>" +
          "<p><a class=\"btn btn-primary\" href=\"" + href + "\">Send by email</a></p>" +
          "<p>Or call <a href=\"tel:" + C.phone + "\">" + C.phoneDisplay + "</a>.</p>");
      }
    });
  }
})();
