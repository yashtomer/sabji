import React from 'react';

function App() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-4 h-16 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 shadow-sm dark:shadow-none z-50">
        <div className="flex items-center gap-3">
          <button className="text-green-700 dark:text-green-400 p-2 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors rounded-lg active:scale-95 active:duration-100">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-2xl font-black text-green-700 dark:text-green-400 tracking-tight font-headline">
            Sabji
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-green-700 dark:text-green-400 p-2 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors rounded-lg active:scale-95 active:duration-100 relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              3
            </span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* Hero Section / Announcement */}
        <section className="mb-6 relative overflow-hidden rounded-xl bg-green-800 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-golden" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span className="text-xs font-bold uppercase tracking-wider text-green-100">Direct from Farm</span>
            </div>
            <h2 className="text-2xl font-extrabold font-headline leading-tight mb-1">Aaj sb fresh aaya hai</h2>
            <p className="text-green-50 opacity-90 text-sm font-medium">Everything is fresh today! Picked at dawn, delivered by dusk.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
            <span className="material-symbols-outlined text-[120px]">local_florist</span>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-6 overflow-x-auto hide-scrollbar flex gap-2 pb-2">
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-green-700 text-white font-bold text-sm shadow-md">All Fresh</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-stone-600 font-semibold text-sm border border-stone-100 hover:bg-stone-50">Fruits</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-stone-600 font-semibold text-sm border border-stone-100 hover:bg-stone-50">Vegetables</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-stone-600 font-semibold text-sm border border-stone-100 hover:bg-stone-50">Exotic</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-stone-600 font-semibold text-sm border border-stone-100 hover:bg-stone-50">Organic</button>
        </section>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Kela (Banana) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="close up of a bunch of ripe yellow bananas on a neutral background with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7CT7ONMgvda6syv8toj5z16a0miLZAfj8xa4QQ4dkzR-TqbeSqV6dt-eZF8KHaxi7bBUQfZ63NwJRgm-BNAKAATGp8VEh7M_OqDjgOBaidy3NNa1zcMh9LScLFJoxDpJjDnRPEpie18S_N9xGuKLQeMBh0ubwrxhzIyoyEullgchIXYK7r_WawVs56h-PNiJNTgUocKk3WGLY1V-hWNR6uMuOwl3SRXUaYK0u6M87bzPEcAS9PibukTDY35iJgswFi2EFBMN2acw" alt="Kela (Banana)" />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-green-700 shadow-sm uppercase">Fresh</div>
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Kela (Banana)</h3>
            <p className="text-xs text-stone-500 mb-3">12pc</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹70</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Tarbooj (Watermelon) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="whole ripe watermelon on a rustic wooden table with vibrant green skin and refreshing summer mood" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSlqn0u9UrzgOgJ5b_q19ZgXfYwDF4CXcEVWMSoOiq_AILcdcDniug7UxHMf5EqrcitCJtVK-RO_b23VWnVGQxAUtVjXf2nYnpBOMcysWLmh6Np385lubHzNvOQZ1lvbDWgd1dKB8YE00HUX1CSwsntILQSd4DlrhejapTEqJwoUiXiCZ1YETYSzvqEZiUPYYEZeqQCea39rVR9JFotqh-VRoBOyeM7n4vX7G8INpi0Vy3YgZW-pSK1BEYtMbn5x3sVBPsAwSroNk" alt="Tarbooj (Watermelon)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Tarbooj (Watermelon)</h3>
            <p className="text-xs text-stone-500 mb-3">1 kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹30</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Kharbuja (Muskmelon) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="ripe cantaloupe muskmelon on a beige surface with soft shadow and morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMnJDVzq6WAL-XoTOs60IlT8Mp4Bk89r7DLUk3icYGsPzS8240kTmZQWHsqBtLFxnglXhC2AYSRyYhBGKmbdJ8lHsWa9xvi3GH132YxlNB8Lv1g0dSu3DOzyAsF2DCd0PtWE1dZCvQmq7x_wgP49nvmrF4iOBtKZh5drBZovnOGIJ0N609fLN3eKW_bkh23o3QyO-Fwt1_XQuFE1veNMP_8-HoZ0mGDWM1a3OvFaosDSnRAyZRcz7bIA_QV9_jl4OzjSTwyHKgX2c" alt="Kharbuja (Muskmelon)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Kharbuja (Muskmelon)</h3>
            <p className="text-xs text-stone-500 mb-3">1 kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹70</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Anar (Pomegranate) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="vibrant red ripe pomegranates artistic composition with dramatic dark background and rich textures" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7NZRFIlXdljG86kQAMGPpporxrynR2KMEgjIJQerLwr9Pm7Sih03jW5SOj-Wz2Nmj522DqZNrCCagxho01jUL9PjQwccvoxTSoO8PgEXaMJ8aYWW9-s9ABVh6O80eEkqqXNBa6LoHo7ACBsI9Xtu4b3KamMQSRwdfOYEL57xQEb-NamHN-yR5Iis5elHc66Cs5Gw_9ZGz0EPhzLbq8aKwwn3koyY-b6EU2WSJ9kklCeHYa71kpkDn1ipdEXAdylGwHO3Mod9oju8" alt="Anar (Pomegranate)" />
              <div className="absolute top-2 right-2 bg-accent text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm uppercase">Rich</div>
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Anar (Pomegranate)</h3>
            <p className="text-xs text-stone-500 mb-3">1 kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹200</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Mango (Aam) - Featured */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-1/3 aspect-square rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="close up of ripe golden mangoes on a rustic jute background with bright warm sunny lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1I8JinzWIL01lHe6ez5VO8qAkLpw5MwcdulVexThVcW2ZTRu8kAy1vCzMxveczcMnW0C0JSASuVoPNkYR990CwGVjlbjaoWjkIXLIMQdjuEXCTOL_SziOWtjO4C2Vwg49PlEmt7Tp7BwSY5tFUu43N69FAIOcqJs26FHA_D1uHj6i1g_nFwXGLnydNs0PPMOXoxe_zAYIp8t9woUsM5J3uagubHYyWAW2Y9JyZdrucBs1IttJwHVPs6yQu7TghG8zmkYWzHXsLiI" alt="Aam (Mango)" />
            </div>
            <div className="w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Season's Best</span>
              </div>
              <h3 className="font-bold text-base mb-0.5">Aam (Mango)</h3>
              <p className="text-xs text-stone-500 mb-2">Premium Alphonso Quality</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-dark leading-none">₹200</span>
                  <span className="text-[10px] text-stone-400">per kg</span>
                </div>
                <button className="bg-accent text-white px-4 py-2 rounded-lg font-bold text-sm active:scale-95 transition-transform flex items-center gap-2">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Bhindi (Ladyfinger) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="fresh green okra ladyfingers arranged neatly on a dark wooden surface with bright overhead lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdGCGPOLjqMRjoLhc3YreNcbnzcpDgDVbV6Fb_JkCfFU67s8Zj_fzIW_1Py_YFUEM_SvKPVJZ70JwH598jBD6DogpW3e2KxM5kFUdLDi0QynkTzZciPOZcX-DDVc5Znp0uoAkplUqewvgNpw2u02A2PomfR2H4zIXE7LG5oDIJHNkOCE2JQFI4BAL5iUBmMJ1rOjzsm-rvL_Ai79fyChvph5TpSboU-R0Yl754LXmBae1ttiwyfvdD9kc7-LrnNkGrVn23AlbNCB4" alt="Bhindi (Ladyfinger)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Bhindi (Ladyfinger)</h3>
            <p className="text-xs text-stone-500 mb-3">1 kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹100</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Tamatar (Tomato) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="pile of ripe red tomatoes with green stems on a neutral kitchen background soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA46N76KQGTOyBwyRKF6YznvPvE9p4yLVbuKUendV78XS0SDKFHUv08PIYC_DLkCAIob2KdxVsFEqb6xPqqeTIs22tjcsJ5qBc6WgQo9UcmFB-a4pn7bqEyVrYvviQQglxyENwqYh0Afppl2TjIUv1WqHHAGcZU4Sv_GaAT9QPaPK3w2uBe2_AWf_cGxRmNVbyVah_PFk3e6550dL-R4_W4xzMP4RQNW804iDYT8J8aD1j4Pf5As739ggOYEitVR_Tr6K0frMuQVUk" alt="Tamatar (Tomato)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Tamatar (Tomato)</h3>
            <p className="text-[10px] text-stone-500 mb-3 h-8 leading-tight">Hybrid: ₹30/kg<br/>Desi: ₹50 for 2kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹30+</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Peyaj (Onion) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="red onions with dry papery skin on a wooden background natural kitchen lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7rlPFAEVwmwHxaMkSc9egEU8KkUC49ZHbEgMvNtnchI0nV5mGGtGXkS_4cF2cl19pvM1AM48tZAZszzdxQ_sSsFfn2_tVHIlFhfOkQMPoh8cy3cvkSCp8dpsWERneHBQWhNrBjMz0YDPyVFrGTTRYqanSmrBcyeEAxgDy_61rSBok20uprVyHCzTO57UCMTj_tv8n6-hF86OA_rfiEmSxVKTn674GhPJd6zmUoFoyGVvEyEOKLzk7uwy98H1H7I9HjkKhAr5jhR4" alt="Peyaj (Onion)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Peyaj (Onion)</h3>
            <p className="text-[10px] text-stone-500 mb-3 h-8 leading-tight">₹30/kg<br/>5kg for ₹130</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹30+</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Aalu (Potato) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="assorted fresh potatoes covered in light earth on a rustic background organic farm fresh look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8XMIHqrEy-hOtBabAbkZilX1xXa8woUq7m0ATLN-Y82HGpLOW9AhZJUkmzL6zGLmyw22l2vexovFTOyFURF80_sF-GI_4t0e6QbLRF5SyPngX32LL0EFhZTowe34RliZ2QtnL7zSL1cRopa5y7cfzfqHjuqB-QQwyEaN12bH9DKLxYwrFTejqQEsKyuKHIGNm9twYqkIC0uzIwjGWPZCsZ0UThLYLkcvsy9GOeiRLYjcF-oMfn-g6vQHGYMXWF3GHRBjUdJDTSS8" alt="Aalu (Potato)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Aalu (Potato)</h3>
            <p className="text-[10px] text-stone-500 mb-3 h-8 leading-tight">₹10/kg to<br/>5kg for ₹70</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹10+</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Simla merch (Capsicum) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="vibrant green capsicum bell peppers shiny skin fresh organic vegetable on white surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlj84pVTRVlrS0SlhfFRhIHaBy_DgegPRmaq-quPFptkteWIr3TB9F1QMDCql3WLA8DT6ir69-OUzMeIse7rhkSFBNSDyaArgP8Il-2jZG9X-NqgzWiVYdX1jJp6dqqA1nRDv1If7EyOBSnR06LLWQP2RHVkw4ifW201J_WMp1JvVmBQpDQ76hl1-V9J0W7FOnPCJtImcdEAxTWYOuQ2hukfqqUpNgKURCPs4bIKYTqFM3RBO2WX_ceEwbj_dlzzlXQoHbsRqCoPQ" alt="Simla merch" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Simla merch</h3>
            <p className="text-xs text-stone-500 mb-3">1 kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹80</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Gajar (Carrot) */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 flex flex-col hover:shadow-md transition-shadow group">
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-stone-50">
              <img className="w-full h-full object-cover" data-alt="bundle of fresh orange carrots with green tops on a wooden crate farm market setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPR0gNO_1zYwycoO11hJvu6dgScpjSZTABwaB-iuOrf83VsMrEhfapbk6tbdM6p83iayK13yTe5IygiyVhgf3b76XKpK9oFlEiDEc64xxf6YXpgZmzocfkBIIQrj1lXZy4chZJyWde1Yse3WVVXwwfV2keSBry2ZVkAfzVQZjF8UVK-nyHSirRYVpQeyDimWTF7uFUsod4wXFuYuj8znwKPk8kqqgin7H2Vze72ma_0T0A67o0jums4fpZ13rFuEEP-kL99buUNSk" alt="Gajar (Carrot)" />
            </div>
            <h3 className="font-bold text-sm mb-1 truncate">Gajar (Carrot)</h3>
            <p className="text-[10px] text-stone-500 mb-3 h-8 leading-tight">Orange: ₹40/kg<br/>Red: ₹60/kg</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹40+</span>
              <button className="bg-green-700 text-white p-1.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Kiwi Pkt */}
        <section className="mt-8 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-lg p-1 shadow-sm overflow-hidden">
            <img className="w-full h-full object-cover rounded-md" data-alt="fresh sliced kiwis with fuzzy brown skin and vibrant green interior seeds macro photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSQUchlhm9eDUq9ybmhNcQHUeLzTaVDsMbgbfiqbTIbEj8sV0VT86dV2XfoIS81fAgvdJSTa-Eg0huh1B28dLLYZtK6aIW87RVstsPw7SBw1pMxTJPdpU4SdxFPDVXXV2W11ftIEXU1l4zNKn8DYzghTdxtfvGqUU0ha-5rrLAR0LImxNKg0tfI_KavqjE4qnTizj-NSRJE648yjAKh3TcjmT_kPv4EwZdNqSPc8mI_YzRKeOwnKP_jtfeo-gqJlPmvnwH4_u2_yg" alt="Kiwi Special" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base">Kiwi Special</h3>
              <span className="bg-golden text-dark text-[10px] font-black px-1.5 py-0.5 rounded">1 PKT</span>
            </div>
            <p className="text-xs text-stone-600 mb-2">Imported High Vitamin C</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-dark">₹120</span>
              <button className="bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform">Add</button>
            </div>
          </div>
        </section>

        {/* More Fruits Grid */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {/* Amrud */}
          <div className="bg-white p-2 rounded-lg border border-stone-100 shadow-sm flex flex-col items-center">
            <div className="w-full aspect-square bg-stone-50 rounded-md overflow-hidden mb-2">
              <img className="w-full h-full object-cover" data-alt="fresh green guava fruit whole and sliced on light surface soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhgYHd5FG7mPqpZcYSBwDXIqy_eyp3V6chXCR3SZ3lop2EaCn6CVAECaZA8OHdWEa6ZWZVjL-rxmt-I8UGP0BFUHf0Y5pBVmNXKISE9AqPecmyp2uyyHXh4fY7wnbaePl0lcvA_sRzUu7lJQIilFh5BO-zl14fiQKUPjrlaAvxMrG8yD4AtkwBYAJ_MSkgJEqMXu09qPuTamUpCW8j7NaSHqVS2G888YN9sBhLEOnkAOtR0_wxDpV_fkRDYRdryHvvfJe7Qf8uibg" alt="Amrud" />
            </div>
            <p className="text-[10px] font-bold text-center truncate w-full">Amrud</p>
            <p className="text-[11px] font-black text-green-700 mt-1">₹120/kg</p>
          </div>

          {/* Chikoo */}
          <div className="bg-white p-2 rounded-lg border border-stone-100 shadow-sm flex flex-col items-center">
            <div className="w-full aspect-square bg-stone-50 rounded-md overflow-hidden mb-2">
              <img className="w-full h-full object-cover" data-alt="brown sapodilla chikoo fruit on a simple background organic fruit texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfu1JsVQreEOdMtkjXvdwRGb6i7XOO3m_3obisLq0pZm8vIU9iolVuaVg4LHZXjMfF93XSUcA3yY-XvSYoeS-HmmZOLj2DIh9cqPnziAiBFQcyf9_kcVELo2Lb29NxjeV1K57zqGQ9YXQGG1Ql75DgY7wyr8GsR8LrBaqnriadJH-dVVXPh0ZNN0R_404cdLbVHAqtJgltZAzxnDGLzmJQVcf_wa59m5KGlr2JVgvvHZaAvYoppUIty8sE1V9qbFjQoZCAS-auTrs" alt="Chikoo" />
            </div>
            <p className="text-[10px] font-bold text-center truncate w-full">Chikoo</p>
            <p className="text-[11px] font-black text-green-700 mt-1">₹100/kg</p>
          </div>

          {/* Pineapple */}
          <div className="bg-white p-2 rounded-lg border border-stone-100 shadow-sm flex flex-col items-center">
            <div className="w-full aspect-square bg-stone-50 rounded-md overflow-hidden mb-2">
              <img className="w-full h-full object-cover" data-alt="whole ripe pineapple with green leaves on a bright yellow background vibrant and tropical" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApxaS_-PZ4_m3ayuO5CEmxHkPYIWtWggMyrre2s7d1HBQCi01J9Kz5L_1l08Sm8eGk3VWOF7lt13H6sGZcrIc9mYEbV1JpPUZL1XG3d8U28Qa0H7-Qe7XcdboD_AODCQL5L8QvB2BD60D5Uub2-5bXwP0xtCFADD508HhtEpD8-Sp5w-LHt_upTtdp35cmXYLcTRtqI0mRETfA-NCxguoCDoBgqKlb3GOk-ONszTi2ZOUDBPb1tLx1Stt7A4Ls22AhXFbs2tmc8Yo" alt="Pineapple" />
            </div>
            <p className="text-[10px] font-bold text-center truncate w-full">Pineapple</p>
            <p className="text-[11px] font-black text-green-700 mt-1">₹100/pc</p>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-t border-stone-100 dark:border-stone-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <a className="flex flex-col items-center justify-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-xl px-3 py-1 active:opacity-80 transition-opacity" href="#">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          <span className="text-[11px] font-medium font-body">Shop</span>
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-3 py-1 hover:text-green-600 dark:hover:text-green-300" href="#">
          <span className="material-symbols-outlined text-[24px]">category</span>
          <span className="text-[11px] font-medium font-body">Categories</span>
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-3 py-1 hover:text-green-600 dark:hover:text-green-300" href="#">
          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          <span className="text-[11px] font-medium font-body">Orders</span>
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-3 py-1 hover:text-green-600 dark:hover:text-green-300" href="#">
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[11px] font-medium font-body">Profile</span>
        </a>
      </nav>
    </>
  );
}

export default App;
