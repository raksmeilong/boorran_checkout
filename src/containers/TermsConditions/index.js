import React from 'react'

const TermsConditions = () => {
  const rawHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Terms and Conditions</title>
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
      <h1 style="font-weight:bold">Terms and Conditions</h1>
      <p style="margin-bottom: 20px; font-size: 14px">Last updated: 16 June 2024</p>

      <p style="margin-bottom: 10px">Please read these Terms and Conditions carefully before using the boorran.com website or mobile application operated by បរ Boorran.</p>
      <p style="margin-bottom: 10px">Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
      <p style="margin-bottom: 20px">By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>
    
      <h2>1. Links to Other Web Sites</h2>
      <p style="margin-bottom: 10px">Our Service may contain links to third-party websites or services that are not owned or controlled by បរ Boorran.</p>
      <p style="margin-bottom: 20px">បរ Boorran has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party websites or services. You further acknowledge and agree that បរ Boorran shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
    
      <h2>2. Changes</h2>
      <p style="margin-bottom: 20px">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
    
      <h2>3. Governing Law</h2>
      <p style="margin-bottom: 10px">These Terms shall be governed and construed in accordance with the laws of Cambodia, without regard to its conflict of law provisions.</p>
      <p style="margin-bottom: 20px">Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>
    
      <h2>Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at raksmeilong@gmail.com.</p>
    </body>
    </html>
  `

  return (
  <div className="container mx-auto max-w-6xl px-4 pt-10" style={{ width: 500, margin: '50px auto' }} dangerouslySetInnerHTML={{ __html: rawHTML }} />
  )
}

export default TermsConditions
