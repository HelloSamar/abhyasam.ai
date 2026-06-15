// Firebase config for english.ai cross-device sync.
// Replace the placeholder values below with your Firebase web app config.
// Until this file is configured, english.ai stays in local-only mode.

window.ENGLISH_AI_FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// Backward compatibility for the earlier app code while the project is renamed.
window.VOCAB_AI_FIREBASE_CONFIG = window.ENGLISH_AI_FIREBASE_CONFIG;

(function applyEnglishAiBranding(){
  function patchText(){
    document.title = document.title.replace(/vocab\.ai/g, "english.ai");
    var brand = document.querySelector(".brand");
    if (brand) brand.innerHTML = "english<span>.ai</span>";
    document.querySelectorAll(".footer").forEach(function(el){
      el.textContent = el.textContent.replace(/vocab\.ai/g, "english.ai");
    });
  }

  function patchExports(){
    if (typeof window.downloadJson === "function" && typeof window.load === "function") {
      window.downloadJson = function(){
        var blob = new Blob([JSON.stringify(window.load(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "english-ai-revision.json";
        a.click();
        URL.revokeObjectURL(a.href);
      };
    }

    if (typeof window.savePdf === "function" && typeof window.load === "function") {
      window.savePdf = function(){
        var h = window.load();
        if (!h.length) {
          if (typeof window.status === "function") window.status("No saved entries to download.", "warn");
          return;
        }
        var escapeHtml = window.esc || function(x){
          return String(x == null ? "" : x).replace(/[&<>\"]/g, function(m){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]; });
        };
        var normalize = window.normalizeMode || function(x){ return x || "Antonyms & Synonyms"; };
        var rows = h.map(function(x, i){
          return "<article><h3>" + (i+1) + ". " + escapeHtml(x.term) + "</h3>" +
            "<p><b>Section:</b> " + escapeHtml(normalize(x.mode)) + "</p>" +
            "<p><b>Hindi Meaning:</b> " + escapeHtml(x.meaning || "-") + "</p>" +
            "<p><b>Synonyms:</b> " + escapeHtml((x.synonyms || []).join(", ") || "-") + "</p>" +
            "<p><b>Antonyms:</b> " + escapeHtml((x.antonyms || []).join(", ") || "-") + "</p>" +
            "<p><b>Example:</b> " + escapeHtml(x.example || "-") + "</p>" +
            "<p><b>Example Meaning in Hindi:</b> " + escapeHtml(x.exampleHindi || "-") + "</p></article>";
        }).join("");
        var w = window.open("", "_blank");
        w.document.write("<!doctype html><html><head><title>english.ai revision PDF</title><meta charset='utf-8'><style>body{font-family:system-ui,Arial,sans-serif;padding:24px;line-height:1.45}h1{margin-top:0}article{border-bottom:1px solid #ddd;padding:12px 0;break-inside:avoid}p{margin:5px 0}@media print{button{display:none}}</style></head><body><button onclick='window.print()'>Save as PDF</button><h1>english.ai - Government Exam English Revision</h1>" + rows + "</body></html>");
        w.document.close();
        w.focus();
        setTimeout(function(){ w.print(); }, 300);
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", patchText);
  } else {
    patchText();
  }
  setTimeout(function(){ patchText(); patchExports(); }, 0);
  setTimeout(function(){ patchText(); patchExports(); }, 300);
})();
