import React, { useEffect, useState } from 'react';
import VehicleCard from './VehicleCard';
import taxi from "../assets/taxi.png"

const Drivers = () => {
    const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://data.cityofnewyork.us/resource/8wbx-tsch.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset current page when search term changes
  };

  const handleFilterYear = (e) => {
    setFilterYear(e.target.value);
    setCurrentPage(1); // Reset current page when filter year changes
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearchTerm = vehicle.vehicle_license_number.includes(searchString) ||
                              vehicle.name.toLowerCase().includes(searchString);
    const matchesYearFilter = filterYear === '' || vehicle.vehicle_year === filterYear;
    return matchesSearchTerm && matchesYearFilter;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <div class="text-center">
    <div role="status">
        <svg aria-hidden="true" class="inline mt-10 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-amber-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
</div>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
    <div className="container mx-auto p-4 flex mt-10">
      <div className="relative flex h-full w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
      <div
        className="">
        <div className="flex items-center gap-4 p-4 mb-2">
          <img src={taxi} alt="brand" className="w-8 h-8" />
          <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Filters
          </h5>
        </div>
        <div className="p-2">
          <div className="relative h-10 w-full min-w-[200px]">
            <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500">
              
            </div>
            <input
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder="Search by name or license" value={searchTerm}
              onChange={handleSearch} />
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Search
            </label>
          </div>
        </div>
        <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
          <div className="relative block w-full">
            <div role="button"
              className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
              
              <select
                  className="w-full h-10 border-2 border-gray-500 focus:outline-none focus:border-amber-500 text-gray-700 rounded px-3 py-1"
                  value={filterYear}
                  onChange={handleFilterYear}
                >
                  <option value="">Filter by year</option>
                  {[...new Set(vehicles.map(vehicle => vehicle.vehicle_year))].sort().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
            </div>
          </div>
        </nav>

      </div>
      </div>
      <div className="w-3/4 px-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedVehicles.map(vehicle => (
            <VehicleCard key={vehicle.vehicle_license_number} vehicle={vehicle} />
          ))}
          
        </div>
        <div className="flex justify-between mt-4 py-10">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-amber-500 text-black-700 px-10 rounded-full">
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-amber-500 text-black-700 py-2 px-10 rounded-full">
            Next
          </button>
        </div>
      </div>
      

    </div>
    </>
  )
}

export default Drivers