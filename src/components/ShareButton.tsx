import { Button } from "@/components/ui/button";

export const ShareButton = () => {
  const handleShare = () => {
    const shareUrl = window.location.href; // current page link
    const shareText = "Check this out!";

    // ✅ If browser supports native share (mobile)
    if (navigator.share) {
      navigator.share({
        title: "My Recipes",
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log("Error sharing", error));
    } else {
      // ✅ Otherwise, open a popup with social links
      const popup = window.open("", "Share", "width=400,height=400");
      if (popup) {
        popup.document.write(`
          <html>
            <head><title>Share</title></head>
            <body style="font-family: sans-serif; display:flex; flex-direction:column; gap:10px; padding:20px;">
              <a href="https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}" target="_blank">📱 Share on WhatsApp</a>
              <a href="https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}" target="_blank">✈️ Share on Telegram</a>
              <a href="mailto:?subject=${encodeURIComponent("My Recipes")}&body=${encodeURIComponent(shareText + " " + shareUrl)}" target="_blank">📧 Share via Gmail</a>
              <a href="https://www.instagram.com/" target="_blank">📷 Share on Instagram (manual)</a>
            </body>
          </html>
        `);
      }
    }
  };

  return (
    <Button variant="hero" onClick={handleShare}>
      Share
    </Button>
  );
};
