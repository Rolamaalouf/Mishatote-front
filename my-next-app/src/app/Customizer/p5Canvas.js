"use client";

import { useEffect, useRef } from "react";
import p5 from "p5";

export default function P5Canvas({ selectedBag, textList, imageFiles, setTextList, setImageFiles, activeElement, setActiveElement }) {
  const canvasRef = useRef(null);
  const p5Instance = useRef(null);

  useEffect(() => {
    if (p5Instance.current) {
      p5Instance.current.remove();
    }

    p5Instance.current = new p5((sketch) => {
      let bagImage;
      let images = [...imageFiles];

      // Preload Images
      sketch.preload = () => {
        bagImage = sketch.loadImage(`/${selectedBag}.${selectedBag === "brown" ? "png" : "jpg"}`);
        images.forEach((file) => (file.img = sketch.loadImage(file.url)));
      };

      // Setup
      sketch.setup = () => {
        let canvas = sketch.createCanvas(400, 450);
        canvas.parent(canvasRef.current);
      };

      // Draw
      sketch.draw = () => {
        sketch.clear();
        sketch.background(240);
        if (bagImage) sketch.image(bagImage, 0, 0, sketch.width, sketch.height);

        // Draw Images
        images.forEach((sticker) => {
          sketch.image(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height);
        });

        // Draw Texts
        textList.forEach((t) => {
          sketch.push();
          sketch.translate(t.x, t.y);
          sketch.rotate((t.rotation * Math.PI) / 180);
          sketch.textAlign(sketch.CENTER, sketch.CENTER);
          sketch.textSize(t.fontSize);
          sketch.fill(t.textColor);
          sketch.textFont(t.fontStyle);
          sketch.text(t.text, 0, 0);
          sketch.pop();
        });
      };

      // Drag Text & Stickers
      sketch.mousePressed = () => {
        [...textList, ...images].forEach((item) => {
          let d = sketch.dist(sketch.mouseX, sketch.mouseY, item.x, item.y);
          if (d < 50) {
            setActiveElement(item.id);
            item.dragging = true;
            item.offsetX = sketch.mouseX - item.x;
            item.offsetY = sketch.mouseY - item.y;
          }
        });
      };

      sketch.mouseDragged = () => {
        [...textList, ...images].forEach((item) => {
          if (item.dragging) {
            item.x = sketch.mouseX - item.offsetX;
            item.y = sketch.mouseY - item.offsetY;
          }
        });
      };

      sketch.mouseReleased = () => {
        [...textList, ...images].forEach((item) => {
          item.dragging = false;
        });
      };

      sketch.saveCanvasAsImage = () => {
        sketch.saveCanvas("custom-tote-bag", "png");
      };

      window.saveCanvasAsImage = sketch.saveCanvasAsImage;
    });

    return () => {
      if (p5Instance.current) p5Instance.current.remove();
    };
  }, [selectedBag, JSON.stringify(textList), JSON.stringify(imageFiles)]);  

  return <div ref={canvasRef}></div>;
}
