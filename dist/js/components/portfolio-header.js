class PortfolioHeader extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <div class = "sticky top-0 w-full top-bar bg-black">
            <div class = " flex items-end justify-between pt-6 pb-2 font-sans ">
                <div class="ml-5 text-4xl cursor-default text-white">
                    Will Robinson
                </div>
                <nav class = "flex items-end">
                    <ul class = "flex space-x-5 mr-5 pb-1 text-lg">
                        <a href="/">
                        <li class="hover:opacity-75 bg-neon-green px-4 pb-1 rounded-3xl font-semibold">
                                projects
                        </li>
                        </a>
                        <a href="/about.html">
                            <li class="hover:opacity-75 bg-neon-pink px-4 pb-1 rounded-3xl font-semibold">     
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