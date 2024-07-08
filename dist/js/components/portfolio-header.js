class PortfolioHeader extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <div class = "sticky top-0 w-full top-bar bg-black shadow-lg mb-5 z-30">
            <div class = "flex flex-col sm:flex-row sm:items-end sm:justify-between pt-3 sm:pt-6 pb-2 font-sans ">
                <div class="sm:ml-5 mb-3 sm:mb-0 text-center sm:text-left text-4xl cursor-default text-white">
                    Will Robinson
                </div>
                <nav class = "flex items-end m-auto sm:m-0">
                    <ul class = "flex space-x-5 sm:mr-5 pb-1 text-lg">
                        <a href="/">
                        <li class="hover:bg-light-green bg-neon-green px-4 pb-1 rounded-3xl font-semibold">
                                projects
                        </li>
                        </a>
                        <a href="/about.html">
                            <li class="hover:bg-light-purple bg-neon-pink px-4 pb-1 rounded-3xl font-semibold">     
                                about
                            </li>
                        </a>
                    </ul>
                </nav>
            </div>
            <hr class="mx-5 h-3 border-white opacity-30">
        </div>
      `;
    }
  }
  
  customElements.define('portfolio-header', PortfolioHeader);