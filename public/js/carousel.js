"use strict";

var carousel = document.querySelector(".carousel"),
  firstImg = carousel.querySelectorAll("img")[0],
  arrowIcons = document.querySelectorAll(".wrapper i");
var isDragStart = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;
var firstImgWidth = firstImg.clientWidth + 14;
var scrollWidth = carousel.scrollWidth - carousel.clientWidth;
var showHideIcons = function showHideIcons() {
  if (carousel.scrollLeft == 0) {
    arrowIcons[0].style.display = "none";
    arrowIcons[0].classList.add("hide");
    if (arrowIcons[0].classList.contains("show")) {
      arrowIcons[0].classList.remove("show");
    }
  } else {
    arrowIcons[0].style.display = "block";
    arrowIcons[0].classList.add("show");
    if (arrowIcons[0].classList.contains("hide")) {
      arrowIcons[0].classList.remove("hide");
    }
  }
  if (carousel.scrollLeft == scrollWidth) {
    arrowIcons[1].style.display = "none";
    arrowIcons[1].classList.add("hide");
    if (arrowIcons[1].classList.contains("show")) {
      arrowIcons[1].classList.remove("show");
    }
  } else {
    arrowIcons[1].style.display = "block";
    arrowIcons[1].classList.add("show");
    if (arrowIcons[1].classList.contains("hide")) {
      arrowIcons[1].classList.remove("hide");
    }
  }
};
arrowIcons.forEach(function (icon) {
  icon.addEventListener("click", function () {
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(function () {
      return showHideIcons();
    }, 60);
  });
});
var autoSlide = function autoSlide() {
  if (carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth)
    return;
  positionDiff = Math.abs(positionDiff);
  var firstImgWidth = firstImg.clientWidth + 14;
  var valDiffernce = firstImgWidth - positionDiff;
  if (carousel.scrollLeft > prevScrollLeft) {
    return (carousel.scrollLeft +=
      positionDiff > firstImgWidth / 3 ? valDiffernce : -positionDiff);
  }
  carousel.scrollLeft -=
    positionDiff > firstImgWidth / 3 ? valDiffernce : -positionDiff;
};
var dragStart = function dragStart(e) {
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};
var dragging = function dragging(e) {
  if (!isDragStart) return;
  e.preventDefault();
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();
};
var dragStop = function dragStop() {
  isDragStart = false;
  carousel.classList.remove("dragging");
  autoSlide();
};
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);
carousel.addEventListener("touchend", dragStop);
var leftBtn = document.getElementById("left");
var rightBtn = document.getElementById("right");
var counter = 1;
document.addEventListener("DOMContentLoaded", function () {
  var x = function x() {
    var counter = 1;
    (function Right() {
      rightBtn.click();
      if (counter < 7) {
        counter++;
        setTimeout(Right, 2000);
      } else {
        y();
      }
    })();
  };
  x();
  var y = function y() {
    var counter = 1;
    (function Left() {
      leftBtn.click();
      if (counter < 7) {
        counter++;
        setTimeout(Left, 2000);
      } else {
        x();
      }
    })();
  };
});
