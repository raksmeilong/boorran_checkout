import React from 'react'

const PrivacyPolicy = () => {
  const rawHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Privacy Policy</title>
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { font-size: 24px; }
        h2 { font-size: 18px; }
        p { font-size: 16px; }
        ol { padding-left: 20px; }
        ol li { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1 style="font-weight:bold">Privacy Policy for Boorran Store</h1>
      <p style="margin-bottom: 20px; font-size: 14px">Last updated: 16 June 2024</p>

      <p style="margin-bottom: 20px">At បរ Boorran, we are committed to protecting the privacy of our users. This Privacy Policy outlines the types of personal information we collect, how we use and protect that information, and your rights regarding your personal data.</p>

      <h2>1. Information We Collect</h2>
      <p style="margin-bottom: 10px">We collect the following types of information:</p>
      <ul style="margin-bottom: 20px">
        <li>•&ensp;Personal identification information (e.g., name, email address, phone number)</li>
        <li>•&ensp;Usage data (e.g., browsing history, search queries, page views)</li>
        <li>•&ensp;Technical data (e.g., IP address, device type, browser type)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p style="margin-bottom: 10px">We use your information for the following purposes:</p>
      <ul style="margin-bottom: 20px">
        <li>•&ensp;To provide and maintain our services</li>
        <li>•&ensp;To improve the user experience</li>
        <li>•&ensp;To communicate with you regarding our services</li>
        <li>•&ensp;To comply with legal obligations</li>
      </ul>

      <h2>3. Data Retention</h2>
      <p style="margin-bottom: 20px">We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, or as required by law.</p>

      <h2>4. Data Security</h2>
      <p style="margin-bottom: 20px">We take the security of your personal information seriously and implement appropriate technical and organizational measures to protect it from unauthorized access, disclosure, alteration, or destruction.</p>

      <h2>5. Third-Party Services</h2>
      <p style="margin-bottom: 20px">We may share your personal information with third-party service providers to help us operate, maintain, and improve our services. We require these third parties to maintain the confidentiality and security of your personal information and to use it only for the purposes for which it was disclosed to them.</p>

      <h2>6. Your Rights</h2>
      <p style="margin-bottom: 20px">You have the right to access, correct, delete, or restrict the use of your personal information. To exercise these rights, please contact us at raksmeilong@gmail.com.</p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p style="margin-bottom: 20px">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.</p>

      <h2>8. Contact Us</h2>
      <p style="margin-bottom: 20px">If you have any questions or concerns about this Privacy Policy, please contact us at raksmeilong@gmail.com.</p>
    </body>
    </html>
  `

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10" style={{ width: 500, margin: '50px auto' }} dangerouslySetInnerHTML={{ __html: rawHTML }} />
  )
}

export default PrivacyPolicy
