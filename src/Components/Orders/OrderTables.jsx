import React from 'react';
import { motion } from "framer-motion";
import { Edit, Search, Trash2 , Eye} from "lucide-react";
import { useState } from "react";


const orderData = [
	{ id: "ORD001", customer: "John Doe", total: 235.4, status: "Delivered", date: "2023-07-01" },
	{ id: "ORD002", customer: "Jane Smith", total: 412.0, status: "Processing", date: "2023-07-02" },
	{ id: "ORD003", customer: "Bob Johnson", total: 162.5, status: "Shipped", date: "2023-07-03" },
	{ id: "ORD004", customer: "Alice Brown", total: 750.2, status: "Pending", date: "2023-07-04" },
	{ id: "ORD005", customer: "Charlie Wilson", total: 95.8, status: "Delivered", date: "2023-07-05" },
	{ id: "ORD006", customer: "Eva Martinez", total: 310.75, status: "Processing", date: "2023-07-06" },
	{ id: "ORD007", customer: "David Lee", total: 528.9, status: "Shipped", date: "2023-07-07" },
	{ id: "ORD008", customer: "Grace Taylor", total: 189.6, status: "Delivered", date: "2023-07-08" },
];

function OrderTables() {

    
        const [filteredProducts, setFilterProducts] = useState(orderData);
        const [SearchTerm, setTerm] = useState("")
    
    
        const handleSearch = (e) => {
            const Term = e.target.value.toLowerCase();
            setTerm(Term)
            const filteredProducts = orderData.filter((item) =>
                item.id.toLowerCase().includes(Term) || item.customer.toLowerCase().includes(Term)
            );
            setFilterProducts(filteredProducts);
    
        };
    

  return (
    <motion.div
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
>

    <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
        <div className='relative'>
            <input
                type='text'
                placeholder='Search products...'
                className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleSearch}
                value={SearchTerm}
            />
            <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
    </div>

    <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-700'>
            <thead>
                <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                        Id
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                    customer
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                    total
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                        Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                        date
                    </th>

                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                        Actions
                    </th>
                </tr>
            </thead>

            <tbody className='divide-y divide-gray-700'>
                {filteredProducts.map((product) => (
                    <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <td className='px-6 py-4 whitespace-nowrap'>
                            
                                <div className='ml-4'>
                                    <div className='text-sm font-medium text-gray-100'>{product.id}</div>
                                </div>
                           
                        </td>


                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                            {product.customer}
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap'>
                            <span className='px-2 inline-flex text-xs leading-5 font-semibold '>
                                {product.total}
                            </span>
                        </td>

                        

                        <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${
                                        product.status === "Delivered"
                                        ? "bg-green-100 text-green-800"
                                        : product.status === "Processing"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : product.status === "Shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {product.status}
                            </span>
                        </td>
                         
                        <td className='px-6 py-4 whitespace-nowrap'>
                            <span className='px-2 inline-flex text-xs leading-5 font-semibold '>
                                {product.date}
                            </span>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                            <button className='text-indigo-400 hover:text-indigo-300 mr-2'>
                                <Edit size={18} />
                            </button>
                            <button className='text-red-400 hover:text-red-300'>
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>


</motion.div>
  )
    }

export default OrderTables;