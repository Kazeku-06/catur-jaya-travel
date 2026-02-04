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
      description: 'Pendiri CV. Global Internindo yang memiliki visi mengembangkan bisnis dari konstruksi ke pariwisata.'
    },
    {
      name: 'Deriawan',
      position: 'Co-Founder',
      image: 'Screnshoot.png',
      description: 'Salah satu pendiri yang berpengalaman dalam industri transportasi dan pariwisata.'
    },
    {
      name: 'Sulton',
      position: 'Operations Manager',
      image: 'Screenshot 2026-02-04 092121.png',
      description: 'Bertanggung jawab dalam operasional harian dan koordinasi tim lapangan.'
    },
    {
      name: 'Maskur',
      position: 'Tour Coordinator',
      image: 'Screenshot 2026-02-04 092129.png',
      description: 'Ahli dalam perencanaan rute wisata dan koordinasi dengan mitra lokal.'
    }
  ];

  const achievements = [
    { number: '6+', label: 'Tahun Pengalaman' },
    { number: '500+', label: 'Pelanggan Puas' },
    { number: '25+', label: 'Destinasi Wisata' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const visionMission = {
    vision: "Menjadi penyedia jasa tour & travel terpercaya yang memberikan pengalaman wisata terbaik di Indonesia.",
    missions: [
      "Memberikan pelayanan tour & travel yang profesional dan berkualitas",
      "Mengembangkan paket wisata yang inovatif dan terjangkau",
      "Membangun kemitraan yang kuat dengan berbagai pihak",
      "Mendukung pengembangan pariwisata lokal",
      "Memberikan kepuasan maksimal kepada setiap pelanggan"
    ]
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Tentang Global Internindo
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Dari komunitas driver online menjadi penyedia jasa wisata terpercaya di Malang dan sekitarnya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story & Achievements Combined */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Cerita Kami
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>
                  CV. Global Internindo awalnya merupakan sebuah badan usaha yang bergerak dalam bidang 
                  perdagangan besar bahan konstruksi, didirikan pada tanggal 3 Maret 2018 oleh saudara Edison.
                </p>
                <p>
                  Untuk bergerak dalam bidang jasa Tour & Travel sendiri bermula dari seringnya berkumpul 
                  saudara Edison, Deriawan, Sulton dan Maskur di sebuah kedai kopi di sekitaran lapangan 
                  Rampal Malang sebagai driver online.
                </p>
                <p>
                  Melihat peluang di kota Malang dan Batu yang merupakan kota wisata dan pendidikan, 
                  kami sepakat membentuk komunitas jasa Tour & Travel. Sejak tanggal 25 Agustus 2018, 
                  kami memutuskan untuk menggunakan nama Global Internindo Tour & Travel Malang.
                </p>
              </div>

              {/* Vision & Mission */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Visi & Misi</h3>
                <div className="mb-4">
                  <h4 className="font-semibold text-primary-600 mb-2">Visi:</h4>
                  <p className="text-sm text-gray-600">{visionMission.vision}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-600 mb-2">Misi:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {visionMission.missions.map((mission, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        {mission}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <img
                src="tim_catur_jaya_mandiri (1).jpeg"
                alt="Our Story"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
                onError={(e) => (e.target.src = '/images/placeholder.jpg')}
              />

              {/* Achievements */}
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {item.number}
                    </div>
                    <p className="text-gray-600 text-sm font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Tim Profesional Kami
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Tim berpengalaman yang siap melayani perjalanan Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary-100 shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                    />
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-2">{member.position}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Contact & Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Informasi Kontak
                </h3>
                
                <div className="space-y-4 mb-6">
                  {[
                    {
                      title: 'Alamat',
                      content: 'Jalan Lesti Utara No.6 Bunulrejo Blimbing Malang, Jawa Timur',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Telepon',
                      content: '+62 813-4647-4165',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Email',
                      content: 'caturjayamandiri4@gmail.com',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      )
                    },
                    {
                      title: 'Jam Operasional',
                      content: 'Senin - Minggu: 08:00 - 22:00 WIB',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    }
                  ].map((info, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {info.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
               
                {/* Interactive Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  <a
                    href={generateWhatsAppUrl('081346474165', 'Halo, saya ingin bertanya tentang paket wisata')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                      <p className="text-xs text-gray-600">Chat langsung dengan admin</p>
                    </div>
                  </a>

                  <a
                    href="tel:+6281346474165"
                    className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Telepon</p>
                      <p className="text-xs text-gray-600">+62 813-4647-4165</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map Location */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Lokasi Kami</h3>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
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
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-900 font-semibold mb-1 text-sm">Kantor Pusat</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    Jalan Lesti Utara No.6 Bunulrejo Blimbing Malang, Jawa Timur, Indonesia.
                  </p>
                  
                  {/* Google Maps Button */}
                  <a
                    href="https://maps.google.com/?q=Jl.+Lesti+Utara+No.6,+Bunulrejo,+Kec.+Blimbing,+Kota+Malang,+Jawa+Timur+65126"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Buka di Google Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Memulai Petualangan Bersama Kami?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/trips">
                <Button variant="secondary" size="lg" className="px-6">
                  Lihat Paket Trip
                </Button>
              </Link>
              <Link to="/travels">
                <Button variant="outline" size="lg" className="px-6 border-white text-white hover:bg-white hover:text-primary-600">
                  Lihat Travel
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;