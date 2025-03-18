'use client';


import Header from '@/app/Components/header';
const AboutUs = () => {
  return (
    <div className="px-6 py-12 bg-gray-100">
      {/* Header Component */}
      <Header />

      <div className="bg-[#A68F7B] h-[50vh] flex items-center justify-center mt-20">
        <h1 className="text-white text-5xl sm:text-6xl font-bold text-center">About Us</h1>
      </div>

      {/* Image */}
      <div className="relative flex justify-center mt-6 sm:-mt-20">
        <img 
          src="/About.png" 
          alt="Beirut Crisis" 
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl rounded-lg shadow-lg" 
        />
      </div>


      {/* Description */}
      <div className="w-4/5 mx-auto mt-10 sm:mt-0">
        <p className="text-center text-[#A68F7B] text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Lebanon is suffering a financial and economic meltdown which the World Bank has labeled as one of the deepest 
          depressions of modern history. Compounded by the Covid-19 pandemic and a massive explosion at Beirut’s port that 
          destroyed large parts of the city and killed more than 215 people.
          <br/><span className='font-bold'>Help us build our Dream!</span> 
        </p>
</div>



   {/* Mission & Vision Section */}
{/* Mission & Vision Section */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-[58px]  mt-20 px-4 md:px-10">

  {/* Left Side - Image & Background (1fr) */}
  <div className="relative col-span-1 bg-[#4A8C8C] flex items-center justify-start px-6 h-[400px] md:h-[600px] lg:h-[750px]">
  <img 
    src="/mission.png" 
    alt="Our Mission"
    className="absolute -bottom-10  right-0 left-30 h-[402px] w-[2110px] rounded-lg shadow-lg"
  />
</div>

  {/* Right Side - Vision & Mission (3fr) */}
  <div className="col-span-3 flex flex-col gap-6 px-4 md:px-6">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">Our Mission And Vision</h2>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">Mission</h3>
          <p className="text-md sm:text-lg md:text-xl text-gray-600">
            At ToteShop, our mission is to empower local artisans and communities by creating stylish, sustainable tote bags that reflect the resilience and creativity of Lebanon. We are committed to supporting economic recovery through meaningful employment and environmentally friendly practices, helping to rebuild our nation one bag at a time.
          </p>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">Vision</h3>
          <p className="text-md sm:text-lg md:text-xl text-gray-600">
            We envision a future where every tote bag tells a story of hope and renewal. By fostering a thriving local economy, we aim to inspire change and promote sustainable living, making a positive impact on our community and environment while providing our customers with high-quality, fashionable products.
          </p>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">Our Customers</h3>
          <p className="text-md sm:text-lg md:text-xl text-gray-600">
            Join our growing family of over 100 satisfied customers who have embraced our mission! Each purchase not only adds a unique piece to your collection but also contributes to the livelihoods of artisans in Lebanon. Together, we can make a difference!
          </p>
        </div>
</div>

    </div>
  );
};

// Exporting the component
export default AboutUs;
