import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 MeraDukaan. All rights reserved.</p>
        <p className="mt-2">
          Follow us on{" "}
          <a href="#" className="text-teal-500">
            Twitter
          </a>{" "}
          |{" "}
          <a href="#" className="text-teal-500">
            Facebook
          </a>{" "}
          |{" "}
          <a href="#" className="text-teal-500">
            Instagram
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
