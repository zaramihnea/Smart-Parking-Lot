import { FormEvent } from "react";
import { useImmer } from "use-immer"

export default function SearchBar() {
    const [input, setInput] = useImmer("");

    const handleChangeInput = (value:string) => {
        setInput(value);
    }

    const handleSubmit = (event:FormEvent) => {
        event.preventDefault();

        console.log(input);
    }

    return(
        <form 
        onSubmit={handleSubmit}
        className=" h-16 bg-sbLight relative flex items-center rounded-full overflow-hidden drop-shadow-xl">
            <button type="submit" className="focus:outline-none">
                <img 
                    src="searchIcon.svg" 
                    alt="searchIcon" 
                    className=" top-2 h-[50px] ml-3"/>
            </button>    
            <input className=" h-full border-black bg-sbLight flex-1 focus:outline-none p-4 text-2xl text-sbText"
                type="text"
                value={input} 
                onChange={(event) => handleChangeInput(event.target.value)}
                placeholder="Search for destination"/>
        </form>
    )
}