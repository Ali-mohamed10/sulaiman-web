import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import flower1 from "../assets/imgs/flower1.webp";
import flower3 from "../assets/imgs/flower3.webp";
import * as htmlToImage from "html-to-image";

export default function LoveCard({
  durationText,
  ourName,
  startDate,
  showCard,
}) {
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    title: "Our Love Journey 💖",
    body: `It's been ${durationText} since our first meeting. Every day with you feels like a new chapter in our love story — timeless, beautiful, and endless. ❤️`,
  });
  const [editableContent, setEditableContent] = useState({
    myName: ourName.myName,
    herName: ourName.herName,
    date: startDate,
  });

  const generateImage = async (format = "png") => {
    if (!cardRef.current || !containerRef.current) return null;

    // حفظ الأنماط الأصلية
    const originalCardStyle = cardRef.current.style.cssText;
    const originalContainerStyle = containerRef.current.style.cssText;

    // إعداد الـ container لتضمين جميع العناصر
    containerRef.current.style.overflow = "visible";
    containerRef.current.style.padding = "2rem"; // مساحة إضافية حول الكارت
    containerRef.current.style.backgroundColor = "#ffffff";

    // إعداد الكارت
    cardRef.current.style.overflow = "visible";
    cardRef.current.style.position = "relative";

    // إجبار الصور لتكون absolute دائماً عند توليد الصورة
    const images = containerRef.current.querySelectorAll("img");
    const originalImageStyles = [];

    images.forEach((img, index) => {
      originalImageStyles[index] = {
        position: window.getComputedStyle(img).position,
        top: img.style.top,
        bottom: img.style.bottom,
        left: img.style.left,
        right: img.style.right,
      };

      // إذا كانت الصورة في الزوايا، تأكد أنها absolute
      if (
        img.classList.contains("sm:absolute") ||
        img.classList.contains("absolute")
      ) {
        img.style.position = "absolute";
        if (
          img.classList.contains("top-0") ||
          img.classList.contains("left-0")
        ) {
          img.style.top = "0";
          img.style.left = "0";
        }
        if (
          img.classList.contains("bottom-0") ||
          img.classList.contains("right-0")
        ) {
          img.style.bottom = "0";
          img.style.right = "0";
        }
      }
    });

    // انتظار تحميل الصور
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          setTimeout(resolve, 2000);
        });
      })
    );

    // انتظار للتأكد من تطبيق الأنماط
    await new Promise((resolve) => setTimeout(resolve, 300));

    const options = {
      useCORS: true,
      cacheBust: true,
      pixelRatio: 2,
      quality: 1,
      backgroundColor: "#ffffff",
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    };

    let dataUrl;
    try {
      // استخدام الـ container بدلاً من الكارت نفسه
      if (format === "png")
        dataUrl = await htmlToImage.toPng(containerRef.current, options);
      else if (format === "jpg" || format === "jpeg")
        dataUrl = await htmlToImage.toJpeg(containerRef.current, options);
      else if (format === "svg")
        dataUrl = await htmlToImage.toSvg(containerRef.current, options);
    } finally {
      // استعادة الأنماط الأصلية
      cardRef.current.style.cssText = originalCardStyle;
      containerRef.current.style.cssText = originalContainerStyle;

      // استعادة أنماط الصور
      images.forEach((img, index) => {
        if (originalImageStyles[index]) {
          const style = originalImageStyles[index];
          img.style.position = style.position;
          img.style.top = style.top;
          img.style.bottom = style.bottom;
          img.style.left = style.left;
          img.style.right = style.right;
        }
      });
    }

    return dataUrl;
  };

  const downloadCard = async (format = "png") => {
    try {
      setLoading(true);
      const dataUrl = await generateImage(format);
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = `love-card.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("❌ Error during download:", err);
    } finally {
      setLoading(false);
    }
  };

  const shareCard = async () => {
    try {
      setLoading(true);
      const dataUrl = await generateImage("png");
      if (!dataUrl) return;

      // تحويل DataURL إلى Blob (ملف فعلي)
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "love-card.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "❤️ Love Card",
          text: "Check out this beautiful card ❤️",
          files: [file],
        });
        console.log("✅ Shared successfully!");
      } else {
        alert("Sharing is not supported in this browser.");
      }
    } catch (error) {
      console.error("❌ Error during sharing:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {showCard && (
        <div className="relative" ref={containerRef}>
          <motion.div
            ref={cardRef}
            className="love-card relative w-full max-w-180 bg-white border text-black shadow-lg shadow-shadow rounded-lg mx-auto my-10"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
          >
            <img
              src={flower3}
              alt="flower3"
              loading="lazy"
              className="w-28 relative md:absolute md:top-0 md:left-0"
              style={{ zIndex: 1 }}
            />
            <div className="content text-center px-5 sm:px-10 py-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
                <input
                  type="text"
                  value={message.title}
                  onChange={(e) =>
                    setMessage({ ...message, title: e.target.value })
                  }
                  className="bg-transparent border-none outline-none text-center w-full text-red-600 font-bold"
                />
              </h2>
              <p className="italic text-gray-500 text-sm sm:text-base text-center md:w-2/3 w-full mx-auto mt-5">
                <textarea
                  value={message.body}
                  onChange={(e) =>
                    setMessage({ ...message, body: e.target.value })
                  }
                  className="bg-transparent border-none outline-none text-center w-full italic text-gray-500 resize-none overflow-hidden"
                  rows={3}
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                />
              </p>
              <div className="mt-4">
                <p className="italic text-gray-500 font-bold text-sm sm:text-base">
                  <input
                    type="text"
                    value={editableContent.myName}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        myName: e.target.value,
                      })
                    }
                    className="bg-transparent border-none outline-none italic font-bold text-gray-500 text-center inline-block w-fit max-w-[180px]"
                  />
                  {" & "}
                  <input
                    type="text"
                    value={editableContent.herName}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        herName: e.target.value,
                      })
                    }
                    className="bg-transparent border-none outline-none italic font-bold text-gray-500 text-center inline-block w-fit max-w-[180px]"
                  />
                </p>
                <p className="italic text-gray-500 text-sm sm:text-base">
                  <input
                    type="text"
                    value={editableContent.date}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        date: e.target.value,
                      })
                    }
                    className="bg-transparent border-none outline-none italic text-gray-500 text-center inline-block min-w-[100px]"
                  />
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <img
                src={flower1}
                alt="flower1"
                loading="lazy"
                className="w-28 relative md:absolute md:bottom-0 md:right-0"
                style={{ zIndex: 1 }}
              />
            </div>
          </motion.div>
        </div>
      )}
      {/* الأزرار */}
      <div className="flex flex-wrap justify-center gap-3">
        {loading ? (
          <div className="flex items-center gap-2 text-pink-600 font-medium">
            <span className="animate-spin w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full"></span>
            Processing...
          </div>
        ) : (
          <>
            <button
              onClick={() => downloadCard("png")}
              className="bg-pink-600 text-white px-5 cursor-pointer py-2 rounded-lg hover:bg-pink-700 transition-all"
            >
              Download PNG
            </button>
            <button
              onClick={() => downloadCard("jpg")}
              className="bg-pink-500 text-white cursor-pointer px-5 py-2 rounded-lg hover:bg-pink-600 transition-all"
            >
              Download JPG
            </button>
            <button
              onClick={shareCard}
              className="bg-green-700 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              Share ❤️
            </button>
          </>
        )}
      </div>
    </AnimatePresence>
  );
}
