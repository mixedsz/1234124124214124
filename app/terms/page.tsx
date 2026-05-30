import type { Metadata } from 'next'
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Terms of Sale | Flake Development | QBCore, Qbox & ESX FiveM Scripts',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tebex Terms &amp; Conditions</h1>
          <p className="text-neutral-500 text-sm mb-10">Last updated: 12th June 2023</p>

          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 space-y-6 text-neutral-400 text-sm leading-relaxed">

            <p>
              This page, together with our <u>Privacy Policy</u> and <u>General Website Terms &amp; Conditions</u>, tells you information about us and informs you of the legal terms and conditions (the &ldquo;<strong>Terms</strong>&rdquo;) which govern your use of our (&ldquo;Seller&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo;, &ldquo;Our&rdquo;) webstore (the &ldquo;Webstore&rdquo;).
            </p>
            <p>
              These Terms will apply to any contract between you and Us in respect of your purchase of video game related products, items and other content (&ldquo;<strong>Products</strong>&rdquo;) on the Webstore (&ldquo;<strong>Contract</strong>&rdquo;).
            </p>
            <p>
              Please read these Terms carefully and make sure that you understand them before ordering from the Webstore. Please note that before placing an order you will be asked to agree to these Terms. If you refuse to accept these Terms, you will not be able to place an order.
            </p>
            <p>
              You should print a copy of these Terms off or save them to your computer for future reference.
            </p>
            <p>
              We amend these Terms from time to time, as set out in Condition 11. Every time you wish to place an order, please check these Terms to ensure that you understand the terms which will apply at that time.
            </p>
            <p>These Terms are only available in the English language.</p>

            {/* Numbered sections */}
            <ol className="space-y-8 list-none pl-0">

              {/* 1 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">1. Information about us</h2>
                <p>
                  We are a Licensed seller for goods for this game, game server or Discord server (&ldquo;Platform&rdquo;). We buy licenses for the use of digital goods and software from the Platform which we sell to end-customers. We are Tebex Limited t/a Tebex, a company registered in England and Wales with company number 08129184 and with our registered office at Tebex Limited, Levy Cohen &amp; Co, 5.2 Central House, 1 Ballards Lane, London, United Kingdom, N3 1LQ. Our VAT numbers are GB167189962 &amp; EU372035465.
                </p>
              </li>

              {/* 2 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">2. Contacting us</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>2.1 &nbsp;If you wish to contact us for technical support, you need to report fraudulent activity, or that a Platform is breaching our or a partner&rsquo;s AUP, you can contact us by visiting <a href="https://www.tebex.io/contact/checkout" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://www.tebex.io/contact/checkout</a>.</li>
                  <li>2.2 &nbsp;If we have to contact you or give you notice in writing, we will do so by e-mail or by pre-paid post.</li>
                </ol>
              </li>

              {/* 3 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">3. Use of the Webstore</h2>
                <p>Your use of the Webstore is governed by our General Website Terms &amp; Conditions. Please take the time to read this document, as it includes important terms which apply to you.</p>
              </li>

              {/* 4 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">4. Our relationship with the Platform and how the Contract is formed between you and Us</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>4.1 &nbsp;Our Webstore will guide you through the steps you need to take to place an order with Us. When using Our order process you should check and amend any errors before submitting your orders to Us. Please take the time to read and check your order at each page of the order process.</li>
                  <li>4.2 &nbsp;We license logos, graphics, wordmarks and other assets for the purposes of advertising and selling non-tangible digital content produced by the Platform. We purchase licenses for the use of such software that provides in-game rewards and benefits from the Platform in question.</li>
                  <li>4.3 &nbsp;The Platform sells us licenses for the use of such products that provide in-game benefits or rewards and we resell these as the merchant for these Products.</li>
                  <li>4.4 &nbsp;As the Seller, We may negotiate and conclude the sale, or decline to conclude a sale for any reason we see fit, including but not limited to potential fraudulent activity or your previous interactions with Us.</li>
                  <li>4.5 &nbsp;When you buy Products on the Webstore, you will be entering into a Contract with Us for this. No contract is formed between You and the Platform in this regard.</li>
                  <li>4.6 &nbsp;<strong className="text-white">All digital software and other digital items we provide are licensed, not sold.</strong> The license We Sell You grants you limited rights to consume and make use of the software and other digital items personally, and only against the account that was originally used to make the purchase. These rights do not give you permission to distribute, resell or share in any way the digital software and other digital items we provide.</li>
                  <li>4.7 &nbsp;If you require support or have any questions or concerns relating to the Contract or the Products, you should contact Us. Please see Condition 2 which details the contact address that you can contact us on.</li>
                </ol>
              </li>

              {/* 5 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">5. Problems with the Products</h2>
                <p>
                  Your contract with Us means that we will make every reasonable effort to resolve any products or queries You may have. To contact us, please refer to Clause 4.6 above. If difficulties are encountered with the performance or non-performance of an ancillary service provided to You (for example, access to the server), that is related or required to use the Product We have sold, then we may refer you to specialised external support, however you should always contact us in the first instance.
                </p>
              </li>

              {/* 6 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">6. The Webstore and Products</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>6.1 &nbsp;All title, ownership rights and intellectual property rights in the Webstore are owned by Us. All title, ownership rights and intellectual property rights in the Products are owned by the Platform and licenses to use the Products are sold to Us. We, the Platform and our licensors reserve all rights in national and international law to protect such rights in the event of any violation of these terms by you.</li>
                  <li>6.2 &nbsp;We do not guarantee continuous, error-free, virus free or secure operation and access to the Webstore and its Products.</li>
                  <li>6.3 &nbsp;Purchases from Us are payments for licenses to use the digital virtual items contained in the purchase. This transaction is final and there are no refunds. If you are banned for breaking the rules of the Platform, you will not be refunded this money. Bans are subject to the full discretion of the Platform, and their rules can be changed at any time. There is no guarantee on being able to access the Platform, and if the server is no longer operated the virtual items are forfeit. All items are virtual and have no value, and cannot be exchanged for real-world currency of any kind.</li>
                  <li>6.4 &nbsp;Some purchases may include the issue of in-game tokens, credits or similar mechanisms of simulated value — &ldquo;Virtual Currency&rdquo;. Any Virtual Currency awarded has no physical value, can only be redeemed on the Platform such Virtual Currency was awarded for, and cannot be exchanged for real-world currency of any kind. We may monitor all purchases, including but not limited to purchases that award Virtual Currency. Any unusual patterns of Virtual Currency use reported to or identified by us will be investigated, and such Virtual Currency may be forfeit at our discretion.</li>
                </ol>
              </li>

              {/* 7 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">7. Restrictions on use of Webstore</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>7.1 &nbsp;You shall not use the Webstore for any purpose other than to make personal, non-commercial purchases of Products, except as otherwise permitted by this Agreement. You shall not sell, rent, lease, license, grant a security interest in the Webstore to others without our prior written consent.</li>
                  <li>7.2 &nbsp;You shall not in whole or in part, copy, reproduce, publish, distribute, translate, modify, create any derivative work from, disassemble, decompile, reverse engineer or otherwise attempt to discover the source code contained in or pertaining to the Webstore.</li>
                </ol>
              </li>

              {/* 8 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">8. How we use your personal information</h2>
                <p>We only use your personal information in accordance with our <u>Privacy Policy</u>. Please take the time to read this document, as it includes important terms which apply to you.</p>
              </li>

              {/* 9 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">9. Age restriction</h2>
                <p>You may only purchase Products from the Webstore if you are at least 16 years old.</p>
              </li>

              {/* 10 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">10. Order process</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>10.1 &nbsp;All sales through the Webstore will be processed through our checkout platform located at https://checkout.tebex.io/. Payment methods, delivery times, taxes and fees will be detailed as part of the checkout process. Please take the time to read and check your order at each stage of the order process.</li>
                  <li>10.2 &nbsp;All orders will be subject to these Terms in addition to any terms and conditions of the publisher of the relevant game and the terms of any ancillary service provided to You that is related or required to use the Product We have sold. In the case of a conflict between any of the said terms and conditions, these Terms will take priority.</li>
                  <li>10.3 &nbsp;You should contact Us in the event that you have any queries or issues with your order or Our terms and conditions of sale.</li>
                </ol>
              </li>

              {/* 11 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">11. Our right to vary these Terms</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>11.1 &nbsp;We amend these Terms from time to time. Please look at the top of this page to see when these Terms were last updated.</li>
                  <li>11.2 &nbsp;Every time you order Products using the Webstore, the Terms in force at the time of your order will apply.</li>
                  <li>11.3 &nbsp;We may revise these Terms as they apply to your order from time to time to reflect any changes in relevant laws and regulatory requirements.</li>
                  <li>11.4 &nbsp;If we have to revise these Terms as they apply to your order, we will contact you to give you reasonable advance notice of the changes and let you know how to cancel your order if you are not happy with the changes. You may cancel either in respect of all the affected Products or just the Products you have yet to receive.</li>
                </ol>
              </li>

              {/* 12 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">12. Right of Withdrawal and Refund for European Union customers</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>12.1 &nbsp;This Condition 12 only applies to European Union (&ldquo;EU&rdquo;) customers.</li>
                  <li>12.2 &nbsp;EU law provides you with a right of withdrawal on software sales (i.e. the agreement between you and Us). This can be excluded for digitally provided content once the content is provided to the end user. The EU statutory right of withdrawal ends 14 days after you purchase or (where you have provided the appropriate consent and acknowledgement) the moment you start downloading the content and services for the first time (whichever is sooner).</li>
                  <li>12.3 &nbsp;We are obligated to inform you of your EU right of withdrawal in detail, which you can find in Schedule 1. If this Condition 12 should in any way differ from Schedule 1, the terms in Schedule 1 shall prevail.</li>
                </ol>
              </li>

              {/* 13 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">13. Further Rights</h2>
                <p>
                  Because you are a consumer, We are under a legal duty to supply Products that are in conformity with the Contract. As a consumer, you have legal rights in relation to Products that are faulty, not as described or not provided with reasonable skill and care. These legal rights are not affected by your right of withdrawal referred to in Condition 12 and Schedule 1 or anything else in these Terms. Advice about your legal rights is available from your local Citizens&rsquo; Advice Bureau or Trading Standards office.
                </p>
              </li>

              {/* 14 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">14. Delivery</h2>
                <p>Delivery of Products from the Webstore is performed by Us. The terms relating to this may form part of your Contract. You should contact Us in the event that you have any queries or issues in respect of this.</p>
              </li>

              {/* 15 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">15. Price of Products</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>15.1 &nbsp;The price of Products to be paid by you is set by Us and will be as quoted on the Webstore at the time you submit your order.</li>
                  <li>15.2 &nbsp;We may change the prices from time to time, but changes will not affect any order you have already placed that has been accepted by Us.</li>
                  <li>15.3 &nbsp;Payment processing related to Products purchased on the Webstore is performed by us and our third-party payment processors.</li>
                  <li>15.4 &nbsp;If VAT (or any similar sales tax) is chargeable on any payments for Products in any territory, we will add such VAT amount to the price to be paid by you.</li>
                  <li>15.5 &nbsp;The terms relating to any mistake caused by incorrect pricing or incorrect treatment of VAT are as agreed between you and Us.</li>
                </ol>
              </li>

              {/* 16 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">16. How to pay</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>16.1 &nbsp;You can only pay for Products using payment methods we specify during your checkout flow.</li>
                  <li>16.2 &nbsp;When you provide payment information to us you represent to us that you are the authorised user of the card, PIN, key or account associated with that payment and you authorise us to process your payment with our chosen third-party payment processors for any fees incurred by you. We may require you to provide your address or other information in order to meet our obligations under applicable tax law.</li>
                  <li>16.3 &nbsp;You agree that you will not use IP proxying or other methods to disguise your place of residence, whether to circumvent geographical restrictions on game content, to purchase at pricing not appropriate to your geography, or for any other purpose.</li>
                  <li>16.4 &nbsp;Please note that some payment methods may attract additional fees for reasons including but not limited to: currency conversions, gateway fees, originator fees. We recommend you check closely the amount to pay on the confirmation screen provided by any acquirer or PSP used by us.</li>
                </ol>
              </li>

              {/* 17 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">17. Our liability</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>
                    <p>17.1 &nbsp;If we fail to comply with these Terms, we are responsible for loss or damage you suffer that is a foreseeable result of our breach of these Terms or our negligence, but we are not responsible for any loss or damage that is not foreseeable.</p>
                    <ul className="mt-2 pl-4 space-y-2 list-none">
                      <li>(a) Loss or damage is foreseeable if it is an obvious consequence of our breach or if it was contemplated by you and us at the time we entered into these Terms.</li>
                      <li>(b) Loss or damage is not foreseeable if it relates to a loss of goodwill, computer failure or malfunction, any indirect, incidental, consequential, special, punitive or exemplary damages, any delay or inability to use the Products or any other damages arising out of or in any way connected with the Products.</li>
                    </ul>
                  </li>
                  <li>17.2 &nbsp;We do not in any way exclude or limit our liability for death or personal injury caused by our negligence or fraud or fraudulent misrepresentation.</li>
                </ol>
              </li>

              {/* 18 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">18. Affiliated brands</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>18.1 &nbsp;We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with any third-party brands or organisations, nor their subsidiaries or affiliates, unless otherwise stated below.</li>
                  <li>
                    <p>18.2 &nbsp;List of affiliated brands:</p>
                    <ul className="mt-2 pl-4 space-y-1 list-disc list-inside">
                      <li>Overwolf</li>
                      <li>Curseforge</li>
                    </ul>
                  </li>
                  <li>18.3 &nbsp;The names, related names, marks, emblems and images of any third-party brands are registered trademarks of their respective owners, and do not imply any endorsement or other relationship. If you believe an item being offered for sale infringes the rights of a third-party brand, contact us using the information in Clause 2.</li>
                </ol>
              </li>

              {/* 19 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">19. Third-Party Sites</h2>
                <p>The Webstore may provide links to other third-party sites or third party vendors who provide content, goods and or services on the Internet. Any separate charge or obligations you incur in your dealings with these third parties is your responsibility. We make no representation or warranties, either express or implied, regarding any third-party site.</p>
              </li>

              {/* 20 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">20. Other important terms</h2>
                <ol className="space-y-3 pl-4 list-none">
                  <li>20.1 &nbsp;We may transfer our rights and obligations under these Terms to another organisation, but this will not affect your rights or our obligations under these Terms.</li>
                  <li>20.2 &nbsp;You may only transfer your rights or your obligations under these Terms to another person if we agree in writing.</li>
                  <li>20.3 &nbsp;These Terms are between you and us. No other person shall have any rights to enforce any of their terms, whether under the Contracts (Rights of Third Parties) Act 1999 or otherwise. However, we and you will not need the consent of a recipient of your gift of a Product to cancel or make any changes to these Terms.</li>
                  <li>20.4 &nbsp;Each of the paragraphs of these Terms operates separately. If any provision or part-provision of these Terms is or becomes invalid, illegal or unenforceable, it shall be deemed deleted, but that shall not affect the validity and enforceability of the rest of this agreement.</li>
                  <li>20.5 &nbsp;If we fail to insist that you perform any of your obligations under these Terms, or if we do not enforce our rights against you, or if we delay in doing so, that will not mean that we have waived our rights against you and will not mean that you do not have to comply with those obligations. If we do waive a default by you, we will only do so in writing, and that will not mean that we will automatically waive any later default by you.</li>
                  <li>20.6 &nbsp;Please note that these Terms are governed by English law. This means any dispute or claim arising out of or in connection with them will be governed by English law. You and we both agree that the courts of England and Wales will have non-exclusive jurisdiction. However, if you are a resident of Northern Ireland you may also bring proceedings in Northern Ireland, and if you are a resident of Scotland, you may also bring proceedings in Scotland.</li>
                  <li>20.7 &nbsp;As a consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident. Nothing in these terms and conditions, including Condition 20.6 affects your rights as a consumer to rely on such mandatory provisions of local law.</li>
                </ol>
              </li>

              {/* 21 */}
              <li>
                <h2 className="text-white font-semibold text-base mb-3">21. Ancillary Services</h2>
                <p>
                  In order to access or use the Products purchased, You may need to access or use ancillary services provided by third parties (such as servers, games clients etc). Access and use of these ancillary services may be subjected to additional terms. We recommend that you locate and review any such terms, as You agree any such terms, or your disagreement with such terms, will not affect or otherwise alter this purchase, and you acknowledge that no refunds will be given after the Purchase is made under any circumstances.
                </p>
              </li>

            </ol>

            {/* Schedule 1 */}
            <div className="mt-10 pt-8 border-t border-neutral-800">
              <h2 className="text-white font-bold text-lg mb-6 text-center">Schedule 1 – Right of Withdrawal for EU Customers</h2>
              <ol className="space-y-4 list-none pl-0">
                <li><span className="text-white font-medium">1.</span> &nbsp;This Schedule only applies to EU customers.</li>
                <li><span className="text-white font-medium">2.</span> &nbsp;As a user of the Webstore domiciled in an EU member state, you have the right to withdraw from any purchase on the Webstore without giving any reason.</li>
                <li><span className="text-white font-medium">3.</span> &nbsp;For any digital content purchased online, you have agreed upon checkout that the withdrawal period will expire 14 days after you purchase such digital content or when you start downloading the content for the first time, whichever is sooner.</li>
                <li><span className="text-white font-medium">4.</span> &nbsp;To exercise the right of withdrawal, you must inform Us of your decision in writing by email to withdraw from the purchase by an unequivocal statement.</li>
                <li><span className="text-white font-medium">5.</span> &nbsp;To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.</li>
                <li><span className="text-white font-medium">6.</span> &nbsp;If you exercise your right of withdrawal, we shall reimburse to you all payments received from you without undue delay and in any event not later than 14 days from the day on which We are informed about your decision to withdraw from this contract. We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.</li>
                <li>
                  <p><span className="text-white font-medium">7.</span> &nbsp;<strong className="text-white">The statutory right of withdrawal is not applicable as regards the supply of digital content which is not supplied on a tangible medium if the performance has begun with your prior express consent and your acknowledgment that you thereby lose your right of withdrawal.</strong></p>
                </li>
              </ol>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
