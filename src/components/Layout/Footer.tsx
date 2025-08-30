export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="text-3xl font-light">Olea</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium Australian skincare crafted with native botanicals for radiant, healthy skin.
            </p>
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="social-icon">
                  <div className="w-4 h-4 bg-current rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', items: ['Face Care', 'Body Care', 'Cleansers', 'Gift Sets'] },
            { title: 'About', items: ['Our Story', 'Ingredients', 'Sustainability', 'Reviews'] },
            { title: 'Support', items: ['Contact Us', 'FAQ', 'Shipping', 'Returns'] },
          ].map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-medium text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="footer-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Olea. All rights reserved. Made with ❤️ in Australia.</p>
        </div>
      </div>
    </footer>
  )
}