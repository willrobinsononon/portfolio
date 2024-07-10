class LinkList extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <div class = "fixed bottom-0 left-0">
          <ul class = "flex flex-col space-y-5 pb-1 text-lg m-3">
              <a href="/">
                  <li class="hover:bg-black bg-transparent border-2 border-black hover:text-white px-4 pb-1 rounded-xl font-semibold text-center">
                          Linkedin
                  </li>
              </a>
              <a href="/">
                  <li class="hover:bg-black bg-transparent border-2 border-black hover:text-white px-4 pb-1 rounded-xl font-semibold text-center">
                          Github
                  </li>
              </a>
              <a href="/">
                  <li class="hover:bg-black bg-transparent border-2 border-black hover:text-white px-4 pb-1 rounded-xl font-semibold text-center">     
                      Email
                  </li>
              </a>
          </ul>
        </div>
      `;
    }
  }
  
  customElements.define('link-list', LinkList);