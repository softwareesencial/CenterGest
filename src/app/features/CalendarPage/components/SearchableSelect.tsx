import React, { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "../../../shared/hooks/useDebounce";

export interface Option {
  id: string;
  label: string;
}

interface SearchableSelectProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  onSearch: (query: string) => Promise<Option[]>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  onSearch,
  label,
  placeholder,
  disabled = false,
  required = false,
  error
}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedQuery.length >= 3) {
        setLoading(true);
        try {
          const results = await onSearch(debouncedQuery);
          setOptions(results);
        } catch (err) {
          console.error("Search error:", err);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setOptions([]);
      }
    };

    searchItems();
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Combobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative mt-1">
          <Combobox.Input
            className={`w-full rounded-md border ${
              error ? "border-red-500" : "border-gray-300"
            } bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${
              disabled ? "bg-gray-100" : ""
            }`}
            displayValue={(option: Option) => option?.label ?? ""}
            onChange={(event: any) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Combobox.Button>

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {loading && (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Cargando...
              </div>
            )}
            {!loading && options.length === 0 && query.length >= 3 && (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                No se encontraron resultados.
              </div>
            )}
            {!loading &&
              options.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={({ active }: {active: any}) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ active, selected }: {active: any, selected: any}) => (
                    <>
                      <span className={`block truncate ${selected ? "font-semibold" : ""}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                            active ? "text-white" : "text-blue-600"
                          }`}
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};