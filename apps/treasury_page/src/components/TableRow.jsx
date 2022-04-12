import React from "react";

function TableRow(props){
    return(

    <div className="mx-10 text-white desktop:text-[1.5rem] laptop:text-[1.3rem] minilap:text-[1.3rem] tablet:text-[1rem] phone:text-[0.8rem] smphone:text-[0.6rem] font-light grid grid-cols-[.5fr,2fr,2fr,2fr,2fr]  bg-[#141518] border-[1px] border-[#8D795B] m-0.5 table_row ">
        <p className="text-white font-light font-Inconsolate text-center p-2 ">{props.id}</p>
        <p className="text-white font-light font-Inconsolate text-center p-2">{props.token}</p>  
        <p className="text-white font-light font-Inconsolate text-center border-3 m-2 bg-[#8D795B] border-[#8D795B] tracking-wide desktop:w-[75%] minilap:w-[90%] mx-auto "> {props.usdValue}</p>
        <p className="text-white font-light font-Inconsolate text-center p-2 ">{props.percentage} %</p>
        <p className="text-white font-light font-Inconsolate text-center p-2 ">{props.tokenValue}</p>
    </div>

    );
}

export default TableRow;


