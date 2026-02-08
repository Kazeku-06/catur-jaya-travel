import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { generateWhatsAppUrl } from '../utils/helpers';

const About = () => {
  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Kami', href: '/about' }
  ];

  const teamMembers = [
    {
      name: 'Edison',
      position: 'Founder & CEO',
      image: 'Screenshot 2026-02-04 092125.png',
      description:
        'Pendiri CV. Global Internindo yang memiliki visi mengembangkan bisnis dari konstruksi ke pariwisata.'
    },
    {
      name: 'Deriawan',
      position: 'Co-Founder',
      image: 'Screnshoot.png',
      description:
        'Salah satu pendiri yang berpengalaman dalam industri transportasi dan pariwisata.'
    },
    {
      name: 'Sulton',
      position: 'Operations Manager',
      image: 'Screenshot 2026-02-04 092121.png',
      description:
        'Bertanggung jawab dalam operasional harian dan koordinasi tim lapangan.'
    },
    {
      name: 'Maskur',
      position: 'Tour Coordinator',
      image: 'Screenshot 2026-02-04 092129.png',
      description:
        'Ahli dalam perencanaan rute wisata dan koordinasi dengan mitra lokal.'
    }
  ];

  const achievements = [
    { number: '6+', label: 'Tahun Pengalaman' },
    { number: '500+', label: 'Pelanggan Puas' },
    { number: '25+', label: 'Destinasi Wisata' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <Layout>
      <div className="overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">
              Tentang Global Internindo
            </h1>
            <p className="text-base md:text-lg lg:text-2xl opacity-90 max-w-3xl mx-auto px-4">
              Dari komunitas driver online menjadi penyedia jasa wisata terpercaya
              di Malang dan sekitarnya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Cerita Kami
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  CV. Global Internindo awalnya merupakan sebuah badan usaha yang bergerak dalam bidang 
                  perdagangan besar bahan konstruksi, didirikan pada tanggal 3 Maret 2018 oleh saudara Edison.
                </p>
                <p>
                  Untuk bergerak dalam bidang jasa Tour & Travel sendiri bermula dari seringnya berkumpul 
                  saudara Edison, Deriawan, Sulton dan Maskur di sebuah kedai kopi di sekitaran lapangan 
                  Rampal Malang. Diawali sekitar bulan Juli 2018, kami sering berkumpul karena mempunyai 
                  profesi yang sama yaitu sebagai driver online.
                </p>
                <p>
                  Sambil menunggu order, disitulah muncul pemikiran untuk membentuk sebuah komunitas jasa 
                  Tour & Travel melihat peluang di kota Malang dan Batu yang merupakan kota wisata dan 
                  pendidikan. Maka dibentuklah komunitas yang diawali kami berempat untuk menawarkan jasa 
                  wisata di Kota Malang – Batu – Bromo dan terkadang sampai keluar daerah.
                </p>
                <p>
                  Seiring berjalannya waktu, komunitas kami semakin banyak kawan-kawan sesama driver online 
                  yang bergabung. Untuk itu kami berempat sepakat membentuk wadah yang resmi dan saudara 
                  Edison mempunyai badan hukum yang resmi yaitu CV. Global Internindo.
                </p>
                <p>
                  Sejak tanggal 25 Agustus 2018, kami memutuskan untuk menggunakan nama Global Internindo 
                  Tour & Travel Malang sebagai wadah kami dalam menjalankan aktivitas.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <img
                src="tim_catur_jaya_mandiri (1).jpeg"
                alt="Our Story"
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
                onError={(e) => (e.target.src = '/images/placeholder.jpg')}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Visi & Misi Kami
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Komitmen kami dalam memberikan layanan wisata terbaik
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Visi Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <div className="inline-block bg-primary-100 text-primary-600 px-4 py-2 rounded-lg font-bold text-sm md:text-base mb-4">
                  VISI
                </div>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  Untuk menjadi jasa wisata terbaik dan memperkenalkan potensi yang ada di wilayah Malang dan sekitarnya.
                </p>
              </div>
            </motion.div>

            {/* Misi Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <div className="inline-block bg-primary-100 text-primary-600 px-4 py-2 rounded-lg font-bold text-sm md:text-base mb-4">
                  MISI
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Membuat standart berwisata yang menyenangkan, murah tapi tidak murahan',
                  'Membuat paket wisata yang menawarkan kemudahan bagi konsumen dengan berbagai pilihan',
                  'Menjalin kerjasama dengan berbagai pihak yang berkompeten',
                  'Memberi jaminan keselamatan bagi anggota dan konsumen',
                  'Menjalankan aktifitas secara terbuka bagi semua anggota'
                ].map((misi, index) => (
                  <li key={index} className="flex items-start text-gray-700 text-sm md:text-base">
                    <span className="text-primary-600 font-bold mr-3 flex-shrink-0 mt-1">•</span>
                    <span className="leading-relaxed">{misi}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {achievements.map((item, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 rounded-2xl shadow-lg p-4 md:p-6 text-center hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-4xl font-bold text-primary-600 mb-2">
                  {item.number}
                </div>
                <p className="text-xs md:text-base text-gray-600 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tim Profesional Kami
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Tim berpengalaman yang siap melayani perjalanan Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-5 md:p-6 text-center hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                    />
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 font-medium text-xs md:text-sm mb-2 md:mb-3">{member.position}</p>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Quick Contact & Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Informasi Kontak
                </h3>
                
                <div className="space-y-4 md:space-y-6">
                  {[
                    {
                      title: 'Alamat',
                      content: 'Jalan Lesti Utara No.6 Bunulrejo Blimbing Malang, Jawa Timur, Indonesia',
                      icon: (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Telepon',
                      content: '+62 813-4647-4165',
                      icon: (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Email',
                      content: 'caturjayamandiri4@gmail.com',
                      icon: (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      )
                    },
                    {
                      title: 'Jam Operasional',
                      content: 'Senin - Minggu: 08:00 - 22:00 WIB',
                      icon: (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    }
                  ].map((info, index) => (
                    <div key={index} className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                          {info.title}
                        </h4>
                        <p className="text-sm md:text-base text-gray-600 break-words">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
               
              {/* Interactive Buttons */}
              <div className="space-y-3 md:space-y-4">
                <a
                  href={generateWhatsAppUrl('081346474165', 'Halo, saya ingin bertanya tentang paket wisata')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white hover:bg-green-50 border border-gray-100 rounded-xl shadow-sm transition-all group w-full"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 md:mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm md:text-base">WhatsApp</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">Chat langsung dengan admin</p>
                  </div>
                </a>

                <a
                  href="tel:+6281346474165"
                  className="flex items-center p-4 bg-white hover:bg-blue-50 border border-gray-100 rounded-xl shadow-sm transition-all group w-full"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 md:mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm md:text-base">Telepon</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">+62 813-4647-4165</p>
                  </div>
                </a>

                <a
                  href="mailto:caturjayamandiri4@gmail.com"
                  className="flex items-center p-4 bg-white hover:bg-purple-50 border border-gray-100 rounded-xl shadow-sm transition-all group w-full"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 md:mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm md:text-base">Email</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">caturjayamandiri4@gmail.com</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Map Location */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg h-full">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Lokasi Kami</h3>
                
                {/* Map Container */}
                <div className="relative mb-4 md:mb-6">
                  <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.2721464450516!2d112.6425713!3d-7.9707577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6284693998f8b%3A0xc3f6d78772a80696!2sJl.%20Lesti%20Utara%20No.6%2C%20Bunulrejo%2C%20Kec.%20Blimbing%2C%20Kota%20Malang!5e0!3m2!1sid!2sid!4v1700000000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Lokasi"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900">Kantor Pusat</h4>
                      </div>
                      <p className="text-gray-700 text-xs md:text-sm leading-relaxed ml-11 break-words">
                        Jalan Lesti Utara No.6 Bunulrejo Blimbing Malang, Jawa Timur, Indonesia.
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 ml-0 sm:ml-11">
                    <a
                      href="https://maps.google.com/?q=Jl.+Lesti+Utara+No.6,+Bunulrejo,+Kec.+Blimbing,+Kota+Malang,+Jawa+Timur+65126"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 md:px-4 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group text-xs md:text-sm"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">Buka di Google Maps</span>
                    </a>
                    
                    <a
                      href="https://maps.google.com/maps/dir//Jl.+Lesti+Utara+No.6,+Bunulrejo,+Kec.+Blimbing,+Kota+Malang,+Jawa+Timur+65126"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 md:px-4 py-2 md:py-2.5 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md group text-xs md:text-sm"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span className="truncate">Petunjuk Arah</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 px-4">
              Siap Memulai Petualangan Bersama Kami?
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
             <Link to="/trips">
                <Button 
                  className="px-6 md:px-8 w-full sm:w-auto !bg-[#FFB800] !text-[#FFFFFF] !border-none hover:bg-[#92C5DE]" 
                  size="lg"
                >
                  Lihat Paket Trip
                </Button>
              </Link>
              <Link to="/travels">
                <Button variant="outline" size="lg" className="px-6 md:px-8 border-white text-white hover:bg-blue 
                hover:text-primary-600 w-full sm:w-auto">
                  Lihat Travel
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default About;