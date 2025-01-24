"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import "./Nav.css";

const navItems = [
  { id: "homeOption", val: "Home" },
  { id: "endowmentOption", val: "Endowment" },
  { id: "termlifeOption", val: "Term Life" },
  { id: "moneybackOption", val: "Money Back" },
  { id: "allplansOption", val: "All Plans" },
  { id: "aboutusOption", val: "About" },
  { id: "contactusOption", val: "Contact Us" },
  { id: "signinOption", val: "Sign In" },
];

export default function Nav() {
  useEffect(() => {
    const moon = document.getElementById("moonContainer");
    const moreOptions = document.getElementById("moreOptions");
    const optionState = document.querySelector("optionState");
    const optionsCard = document.getElementById("optionsCard");

    moon.addEventListener("click", () => {
      moon.parentElement.style.backgroundColor = "#476CB2";
      moon.parentElement.children[1].style.transform = "translate(-50%, 0)";
    });
    moon.parentElement.children[2].addEventListener("click", () => {
      moon.parentElement.style.backgroundColor = "#BDCEEF";
      moon.parentElement.children[1].style.transform = "translate(50%, 0)";
    });

    let toggleNum = 1;
    moreOptions.addEventListener("click", () => {
      if (toggleNum == 1) {
        moreOptions.children[0].style.rotate = "45deg";
        moreOptions.children[0].style.transform = "translate(0, 1.6vh)";
        moreOptions.children[1].style.opacity = "0";
        moreOptions.children[2].style.rotate = "-45deg";
        moreOptions.children[2].style.transform = "translate(0, -1.6vh)";
        toggleNum = 0;
        optionsCard.classList.add("visible");
        optionsCard.classList.remove("hidden");
      } else {
        moreOptions.children[0].style.rotate = "0deg";
        moreOptions.children[0].style.transform = "translate(0, 0vh)";
        moreOptions.children[1].style.opacity = "1";
        moreOptions.children[2].style.rotate = "0deg";
        moreOptions.children[2].style.transform = "translate(0, 0vh)";
        toggleNum = 1;
        optionsCard.classList.remove("visible");
        optionsCard.classList.add("hidden");
      }
    });
  });
  return (
    <nav id="navBar-container">
      <div id="navBar">
        <div className="sideNav leftNav">
          <div className="logo"></div>
        </div>
        <div className="sideNav rightNav">
          <div className="navItem">
            <div id="themeContainer">
              <div className="icon-container" id="moonContainer">
                <img id="moon" src="/Vector 1.png" alt="" />
              </div>
              <div id="themeSelector"></div>
              <div className="icon-container" id="sunContainer">
                <img id="sun" src="/Polygon 1.png" alt="" />
              </div>
            </div>
          </div>
          <div className="navItem">
            <div id="moreOptions">
              <div className="optionsBar"></div>
              <div className="optionsBar"></div>
              <div className="optionsBar"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="optionsCard" className="hidden">
        <div id="homeOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img src="/Home Page.png" alt="" />
          </div>
          <span className="divElements spandiv">Home</span>
        </div>
        <div id="endowmentOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img src="/Heart with Pulse.png" alt="" />
          </div>
          <span className="divElements spandiv">Endowment</span>
        </div>
        <div id="termlifeOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img id="moon" src="/Life Cycle.png" alt="" />
          </div>
          <span className="divElements spandiv">Term Life</span>
        </div>
        <div id="moneybackOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img id="moon" src="/Coin in Hand.png" alt="" />
          </div>
          <span className="divElements spandiv">Money Back</span>
        </div>
        <div id="allplansOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img id="moon" src="/Select All.png" alt="" />
          </div>
          <span className="divElements spandiv">All Plans</span>
        </div>
        <div id="aboutusOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img id="moon" src="/Info.png" alt="" />
          </div>
          <span className="divElements spandiv">About</span>
        </div>
        <div id="contactusOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img id="moon" src="/Phone Bubble.png" alt="" />
          </div>
          <span className="divElements spandiv">Contact Us</span>
        </div>
        <div id="signinOption" className="optionsOption">
          <div className="optionImgContainer divElements">
            <img id="moon" src="/Sign In.png" alt="" />
          </div>
          <span className="divElements spandiv">Sign In</span>
        </div>
      </div>
    </nav>
  );
}
