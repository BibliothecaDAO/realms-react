import React from "react";
import biblio_logo from '../resources/biblio_logo.png'

function Footer() {
    return (
        <div className="pb-[4rem]">
            <div className="border-[1px] border-[#8D795B] mb-[4rem]"></div>
            <div className="grid minilap:grid-cols-4 smphone:grid-cols-2 px-[5rem]">
                <div className="flex items-center justify-center">
                    <img className="w-[10rem] h-[10rem]" src={biblio_logo} alt="bibliotheca logo"/>
                </div>
                <div className="font-light text-white font-Inconsolata py-[2rem] desktop:px-[3rem] laptop:px-[2rem] smphone:px-[1.5rem]">
                    <h3 className="mb-[1.5rem] text-[1.2rem]">WEBSITES</h3>
                    <ul className="text-[1.1rem]">

                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://atlas.bibliothecadao.xyz/">Bibliotheca DAO</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://realms.briq.construction/">Briqs</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://testnet.playoasis.xyz/">Play Oasis</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://starkware.co/starknet/">StarkWare</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://atlas.bibliothecadao.xyz/">Atlas</a></li>

                    </ul>
                </div>
                <div className="font-light text-white font-Inconsolata py-[2rem] desktop:px-[3rem] laptop:px-[2rem] smphone:px-[1.5rem]">
                    <h3 className="mb-[1.5rem] text-[1.2rem]">DISCORDS</h3>
                    <ul className="text-[1.1rem]">
                        
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://discord.com/invite/uQnjZhZPfu">Bibliotheca DAO</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://discord.com/invite/7X9gJQ3ed9">Briqs</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://discord.com/invite/ZGRxkeYKNq">Play Oasis</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://discord.com/invite/XzvgKTTptb">StarkWare</a></li>
                    </ul>
                </div>
                <div className="font-light text-white font-Inconsolata py-[2rem] desktop:px-[3rem] laptop:px-[2rem] smphone:px-[1.5rem]">
                    <h3 className="mb-[1.5rem] text-[1.2rem]">TWITTERS</h3>
                    <ul className="text-[1.1rem]">
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://twitter.com/LootRealms">Bibliotheca DAO</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://twitter.com/briqNFT">Briqs</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://twitter.com/PlayOasisXYZ">Play Oasis</a></li>
                        <li className="py-[0.2rem]"><a className="hover:underline underline-offset-1"href="https://twitter.com/StarkWareLtd">StarkWare</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer