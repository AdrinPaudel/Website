"use client";
import React, { useEffect } from "react";
import "./Footer.css"
export default function Footer(){

    const resList=['Insured Ammount Calculator',
        'Term Completion Finder',
        'Payout lasting Calculator',
        'Articles',
        'List of all life policies',
        'List of all companies']
    
    const resListArr= resList.map((listText, index) =>{
    return (
    <li className="resText" key={index}>{listText}</li>
    )
    })
    const otherList=[
        'About us',
        'Privacy policy',
        'Terms and conditions',
        'Site map']
    const otherListArr= otherList.map((listText, index) =>{
    return (
    <li className="resText" key={index}>{listText}</li>
    )
    })

    const contactInfo=['Bafal, Kathmandu',
        'Locate us Here',
        '+977-982137877123124124',
        'Click to Email Us',
        'Sun-Fri 9:00AM - 06:00PM']
    const contactInfoArr= contactInfo.map((listText, index) =>{
    return (
    <li className="conText" key={index}>{listText}</li>
    )
    })

    const followList= [
        "/icons8-facebook-24.png" ,
        "/icons8-instagram-24.png" ,
        "/icons8-linkedin-24.png" ]
    const followListArr= followList.map((listIcon, index) =>{
        return (
            <img src={listIcon} key={index} style={{filter:'invert()'}}/>
        )
        })

    return(
        <div id="footerContainer">
            <div id="upperContent">
                <div id="resources">
                    <div id="resourcesCard">
                            <h3 className="resText">Resources</h3>
                            {resListArr}
                            <h3 className="resText">Others</h3>
                            {otherListArr}
                    </div>
                </div>
                <div id="marginDiv"></div>
                <div id="contact">
                    <div id="contactInfo" className="contactEl">
                        <div id="contInfoContainer">
                            <h5 className="conText">Contact Info</h5>
                            {contactInfoArr}
                        </div>
                    </div>
                    <div id="followUs" className="contactEl">
                        <span>Follow us on : </span>
                        {followListArr}
                    </div>
                </div>
                <div></div>
            </div>
            <div id="contentBr"></div>
            <div id="lowerContent">
                <span>Visitors are hereby informed that their information submitted on the website may be shared with insurers.Product information is authentic and solely based on the information received from the insurers.</span>
                <br/>
                <span>© Copyright 2024-2024 insurancesathinepal.com. All Rights Reserved.</span>
            </div>
        </div>
    );
}