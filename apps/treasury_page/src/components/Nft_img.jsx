import React from "react";

function Nft_img(props) {
    return (
        <div className="flex flex-col standard:w-[12rem] standard:h-[14rem] laptop:w-[10rem] laptop:h-[12rem] minilap:w-[9rem] minilap:h-[11rem] items-center">
            <img src={props.url} alt="map" className="mb-[.5rem] rounded-[15%] desktop:w-[12rem] laptop:w-[10rem] minilap:w-[9rem] tablet:w-[8rem] smphone:w-[6rem]" />
            <p className="font-Inconsolata text-sm">{props.name}</p>
        </div>
    )
}

export default Nft_img