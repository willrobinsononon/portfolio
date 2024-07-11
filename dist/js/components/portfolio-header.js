class PortfolioHeader extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <div class = "sticky top-0 w-full top-bar nav-fade shadow-lg mb-5 z-30">
            <div class = "flex flex-col sm:flex-row sm:items-end sm:justify-between pt-3 sm:pt-6 font-sans pb-5">
                <div class="sm:ml-5 mb-3 sm:mb-0 text-center sm:text-left text-4xl cursor-default text-white">
                    <span class="font-bold"> Will Robinson</span> <span class="ml-10 text-2xl hidden md:inline text-slate-200">Web Developer</span>
                </div>
                <nav class = "flex items-end mx-auto sm:mx-0">
                    <ul class = "flex space-x-5 sm:mr-5 pb-1 text-lg">
                        <a href="/">
                        <li class="transition-all duration-200 hover:bg-light-purple bg-transparent border-2 border-light-purple hover:text-black text-light-purple px-4 pb-1 rounded-xl font-semibold text-center " >
                                projects
                        </li>
                        </a>
                        <a href="/about">
                            <li class="transition-all duration-200 hover:bg-light-green bg-transparent border-2 border-light-green hover:text-black text-light-green px-4 pb-1 rounded-xl font-semibold text-center">     
                                about
                            </li>
                        </a>
                    </ul>
                </nav>
            </div>
            
        </div>
      `;
    }
  }
  
  customElements.define('portfolio-header', PortfolioHeader);