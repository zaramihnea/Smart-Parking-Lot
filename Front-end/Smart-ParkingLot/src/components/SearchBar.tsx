import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

interface SearchBarProps {
  placeholder: string;
}



interface LocationSuggestion {
  id: string;
  name: string;
}

interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  // used to focus the input field when a suggestion is clicked
  const inputRef = useRef<HTMLInputElement>(null);
  const baseUrl = process.env.API_BASE_URL;

  const [baseUrlString]= useState<string>(baseUrl || 'http://localhost:8081');

  const navigate = useNavigate();
  
  const handleChangeInput = (value: string) => {
    setInput(value);
  };
  
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(input);
    navigate(`/loading?address=${encodeURIComponent(input)}`);
  };
  
  const [input, setInput] = useImmer("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

  // Function to fetch suggestions
  const fetchSuggestions = (query : string) => {
    axios.get(`${baseUrlString}/autocomplete?input=${query}`)
      .then(response => {
        // Assuming the response structure matches the expected
        const suggestions = response.data.predictions.map((item: AutocompletePrediction) => ({
          id: item.place_id,
          name: item.description
        }));
        setSuggestions(suggestions);
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
        setSuggestions([]);
      });
  };

  useEffect(() => {
    if (input.length > 2) { // Fetch suggestions when input length is greater than 2
        fetchSuggestions(input);
    } else {
        setSuggestions([]);
    }
  }, [input]);

  const focusInput = () => {
    // Check if the input element exists and focus on it
    inputRef.current?.focus();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="m-1 h-14 bg-gray-300 dark:bg-gray-700 relative flex items-center rounded-full overflow-hidden shadow-md dark:shadow-none"
      >
        <div className="flex items-center pl-4 pr-2">
          <img
            src="/searchIcon.svg"
            alt="searchIcon"
            className="h-6 w-6 text-purple-600"
          />
        </div>
        <input
          className="h-full bg-gray-300 dark:bg-gray-700 flex-1 focus:outline-none pl-2 pr-4 text-2xl text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          type="text"
          ref={inputRef}
          value={input}
          onChange={(event) => handleChangeInput(event.target.value)}
          placeholder={placeholder}
        />
      </form>
      <div>
        {suggestions.length > 0 && (
          <ul className="absolute grid gap-1 p-2 bg-gray-800 w-full rounded-lg cursor-pointer select-none">
            {suggestions.map(suggestion => (
              <li className="p-3 rounded-lg bg-gray-700 hover:bg-gray-900 " key={suggestion.id} onClick={() => {setInput(suggestion.name); focusInput()}}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;