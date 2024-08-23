import logo from "../assets/logo.png"

const Header = () => {

    const navlist = [
        { title: "Home", nav: "" },
        { title: "About", nav: "" },
        { title: "Products", nav: "" },
        { title: "Contacts", nav: "" },
    ]

    return (
        <header className="bg-teal-500 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center cursor-pointer transform hover:scale-105 transition-transform">
                    <img src={logo} alt="Logo" className="h-24 -my-2" />
                    <h1 className="text-3xl font-bold text-gray-900">MeraDukaan</h1>
                </div>
                <ul className="flex space-x-6">
                    {
                        navlist.map(nav => (
                            <li className=" overflow-hidden transform hover:scale-125 transition-transform">
                                <a href="#" className="text-gray-900 text-xl hover:text-gray-900 hover:font-bold ">
                                    {nav.title}
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </header>
    );
};

export default Header;
