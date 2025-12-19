it("Color Wheel - Quay và chọn đúng màu ngay lần đầu", () => {
  cy.visit("https://practice.expandtesting.com/color-wheel");

  // Click Play Game để quay
  cy.contains("button, a", /play game/i).click();

  //  Chờ wheel dừng (màu tại mũi tên ổn định)
  waitWheelStopAndGetColorAtArrow().then((targetRgb) => {
    // Lấy tất cả buttons đáp án màu (lọc bỏ Play/Reset)
    cy.get("button")
      .filter((_, el) => {
        const t = (el.innerText || "").trim();
        return (
          t.length > 0 &&
          !/play game/i.test(t) &&
          !/reset game/i.test(t)
        );
      })
      .then(($btns) => {
        const buttons = [...$btns];

        // Đọc background-color từng nút -> match gần nhất với targetRgb
        const parsed = buttons
          .map((btn) => {
            const bg = getComputedStyle(btn).backgroundColor; // "rgb(r,g,b)" hoặc "rgba(...)"
            const rgb = parseCssRgb(bg);
            if (!rgb) return null;
            return { btn, rgb, text: (btn.innerText || "").trim() };
          })
          .filter(Boolean);

        expect(parsed.length, "Có danh sách nút màu").to.be.greaterThan(0);

        const best = parsed
          .map((x) => ({ ...x, d: colorDistance(x.rgb, targetRgb) }))
          .sort((a, b) => a.d - b.d)[0];

        cy.wrap(best.btn).click();

        //  Assert kết quả (tùy UI, mình kiểm tra kiểu "Correct"/"Success")
        cy.contains(/correct|success|well done|great/i).should("be.visible");
        cy.log(`Target RGB: ${targetRgb.join(",")} -> Clicked: ${best.text}`);
      });
  });

  // ===== Helpers =====

  function waitWheelStopAndGetColorAtArrow() {
    // Lấy pixel ở vị trí đầu mũi tên (thường nằm phía trên giữa canvas)
    // Nếu UI của bạn khác, chỉnh offset: x = w/2, y = 5..15
    const sample = () =>
      cy.get("canvas").then(($c) => {
        const canvas = $c[0];
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        // giả định mũi tên trỏ vào mép trên của vòng tròn (giữa trên)
        const x = Math.floor(w / 2);
        const y = Math.floor(h * 0.08); // ~8% chiều cao từ trên xuống

        const data = ctx.getImageData(x, y, 1, 1).data; // [r,g,b,a]
        return [data[0], data[1], data[2]];
      });

    // poll đến khi 3 lần liên tiếp giống nhau (wheel đã dừng)
    return sample().then((c1) => {
      return cy.wait(250).then(() =>
        sample().then((c2) => {
          return cy.wait(250).then(() =>
            sample().then((c3) => {
              const stable =
                colorDistance(c1, c2) < 6 && colorDistance(c2, c3) < 6; // ngưỡng nhỏ
              if (stable) return c3;

              // chưa ổn định -> đợi thêm rồi thử lại (đệ quy)
              return cy.wait(300).then(() => waitWheelStopAndGetColorAtArrow());
            })
          );
        })
      );
    });
  }

  function parseCssRgb(css) {
    // "rgb(12, 34, 56)" hoặc "rgba(12,34,56,1)"
    const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    return [Number(m[1]), Number(m[2]), Number(m[3])];
  }

  function colorDistance(a, b) {
    // khoảng cách Euclidean trong RGB
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }
});
