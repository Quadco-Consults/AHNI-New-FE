import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { FilterField } from "src";

interface Props {
  filters: FilterField[];
  values: Record<string, any>;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
  onClose: () => void;
}

export const FilterForm: React.FC<Props> = ({
  filters,
  values,
  onChange,
  onClose,
}) => {
  const handleChange = (name: string, value: any) => {
    onChange({ ...values, [name]: value });
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          className='fixed inset-0 bg-black bg-opacity-40 z-40'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Drawer panel */}
        <motion.div
          className='fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg overflow-auto flex flex-col'
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className='flex items-center justify-between px-4 py-3 border-b'>
            <h2 className='text-lg font-semibold'>Filter</h2>
            <button onClick={onClose}>
              <X className='h-5 w-5 text-gray-600' />
            </button>
          </div>

          <div className='p-4 space-y-4 bg-gray-100  flex-1 flex-col'>
            <div className='flex-1'>
              <div className='grid grid-cols-1 gap-4'>
                {filters.map((field) => (
                  <div key={field.name} className='flex flex-col space-y-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      {field.label}
                    </label>

                    {field.type === "enum" ? (
                      <select
                        value={values[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      >
                        <option value=''>-- Select --</option>
                        {field.enumValues?.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "boolean" ? (
                      <select
                        value={values[field.name] ?? ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value === "true")
                        }
                        className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      >
                        <option value=''>-- Select --</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                      </select>
                    ) : (
                      <input
                        type={field.type === "date" ? "date" : "text"}
                        placeholder={field.placeholder}
                        value={values[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex justify-between px-4 py-3'>
            <button
              className='bg-primary text-white rounded px-4 py-2'
              onClick={() => {
                const cleared = Object.fromEntries(
                  filters.map((f) => [f.name, ""])
                );
                onChange(cleared);
                onClose();
              }}
            >
              Reset
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};
