import { FormEvent } from "react";
import { useImmer } from "use-immer"

export default function SearchBar() {
    const [input, setInput] = useImmer("");

    const handleChangeInput = (value: string) => {
        setInput(value);
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        console.log(input);
    }

    return (
        <form
        onSubmit={handleSubmit}
        className="m-1 h-14 bg-gray-300 dark:bg-gray-700 relative flex items-center rounded-full overflow-hidden shadow-md dark:shadow-none"
      >
        <div className="flex items-center pl-4 pr-2">
          <img
            src="searchIcon.svg"
            alt="searchIcon"
            className="h-10 w-10"
          />
        </div>
        <input
          className="h-full bg-gray-300 dark:bg-gray-700 flex-1 focus:outline-none pl-2 pr-4 text-2xl text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          type="text"
          value={input}
          onChange={(event) => handleChangeInput(event.target.value)}
          placeholder="Search for destination"
        />
      </form>
    )
}