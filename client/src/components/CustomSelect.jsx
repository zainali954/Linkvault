// components/ui/CustomSelect.jsx
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import useDarkMode from "../hooks/useDarkMode";

const getSelectStyles = (isDarkMode) => ({
    control: (base, state) => ({
        ...base,
        backgroundColor: isDarkMode ? '#262626' : '#fff',
        borderColor: isDarkMode ? '#525252' : '#d1d5db',
        minHeight: '42px',
        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
        '&:hover': {
            borderColor: isDarkMode ? '#737373' : '#9ca3af',
        },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    input: (base) => ({
        ...base,
        color: isDarkMode ? '#e5e5e5' : '#171717',
        margin: 0,
    }),
    placeholder: (base) => ({
        ...base,
        color: isDarkMode ? '#a3a3a3' : '#6b7280',
    }),
    singleValue: (base) => ({
        ...base,
        color: isDarkMode ? '#e5e5e5' : '#171717',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? '#262626' : '#fff',
        border: `1px solid ${isDarkMode ? '#525252' : '#d1d5db'}`,
        zIndex: 20,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#2563eb'
            : state.isFocused
                ? (isDarkMode ? '#3b82f6' : '#dbeafe')
                : 'transparent',
        color: state.isSelected
            ? '#fff'
            : state.isFocused && !isDarkMode
                ? '#1e40af'
                : isDarkMode
                    ? '#e5e5e5'
                    : '#171717',
        '&:active': {
            backgroundColor: '#1d4ed8',
        },
        cursor: 'pointer',
        padding: '8px 12px',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
        borderRadius: '9999px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: isDarkMode ? '#bfdbfe' : '#1e40af',
        fontSize: '0.875rem',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: isDarkMode ? '#93c5fd' : '#60a5fa',
        borderRadius: '0 9999px 9999px 0',
        '&:hover': {
            backgroundColor: isDarkMode ? '#1e40af' : '#bfdbfe',
            color: isDarkMode ? '#fff' : '#1e3a8a',
        },
    }),
});

const CustomSelect = ({
    id,
    label,
    value,
    onChange,
    options,
    placeholder,
    isLoading,
    isMulti = false,
    isClearable = true,
    isCreatable = false,
    onCreateOption = () => { },
}) => {
    const [darkMode, toggleDarkMode] = useDarkMode()

    const styles = getSelectStyles(darkMode);
    const SelectComponent = isCreatable ? CreatableSelect : Select;

    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
                {label}
            </label>
            <SelectComponent
                inputId={id}
                value={value}
                onChange={onChange}
                options={options}
                placeholder={placeholder}
                isLoading={isLoading}
                isClearable={isClearable}
                isMulti={isMulti}
                styles={styles}
                onCreateOption={isCreatable ? onCreateOption : undefined} // ✅ only pass if creatable
            />
        </div>
    );
};

export default CustomSelect;