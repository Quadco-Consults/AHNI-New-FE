import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <div className='py-6'>
      <h3 className='text-[20px] font-semibold mb-6 text-center'>
        STANDARD PURCHASE ORDERS TERMS AND CONDITIONS
      </h3>
      <div className='flex justify-between gap-8'>
        <div className='flex-1 space-y-2'>
          <p className='text-[13px] leading-6'>
            These Standard Purchase Orders Terms and Conditions are particularly
            incorporated into, and are material terms and conditions for every
            Purchase Order entered into by and between Achieving Health Nigeria
            Imitative(AHNi) its vendors (“Vendor”) and shall apply to all goods,
            services and works ordered by AHNi and provided for by the Vendor.
            By signing a Purchase Order with AHNi, Vendor acknowledges that it
            has read, understood and agreed to these Terms and Conditions. Each
            Purchase Order issued by AHNi is subjected to these Terms and
            Conditions and constitutes an agreement (“Agreement”) with respect
            to each party’s rights and obligations hereunder listed. In the
            event of any inconsistency between these Purchase Order Terms and
            Conditions and the terms and conditions of any other agreement or
            document, the Purchase Order Terms and Conditions shall prevail and
            govern to the extent of that inconsistency.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            1. LEGAL STATUS:
          </h4>
          <p className='text-[13px] leading-6'>
            Nothing in the Terms and Conditions or the Purchase Order shall at
            any time be interpreted to create employer and employee
            relationship, partnership, principal and agent relationship, or
            joint venture between AHNi and Vendor. Vendor shall be fully
            responsible for all goods, services or works performed by its
            employees, representatives, agents, and sub- Vendors and for all
            acts and omissions of such employees, representatives, agents, and
            sub- Vendors. Neither AHNi nor Vendor shall have the power to
            obligate the other in any manner whatsoever, except as specifically
            provided herein. AHNi and Vendor agree that Terms and condition or
            the Purchase Order creates no relationship between Vendor and AHNi’s
            Donor. Vendor has no right to submit claims directly to AHNi’s Donor
            and Donor assumes no liability for any third-party claims under this
            Purchase Order.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            2. PROPERTY INFORMATION AND CONFIDENTIALITY:
          </h4>
          <p className='text-[13px] leading-6'>
            Vendor shall consider all data, documentation, drawings,
            specifications software and other information furnished by AHNi to
            be confidential and proprietary and shall not disclose any such
            information to any other person, or use such information itself for
            any purpose other than that for which it was intended in completing
            this Purchase Order, unless Vendor obtains written permission from
            AHNi to do so. Vendor agrees to execute AHNi’s standard
            Non-Disclosure Agreement upon request.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            3. COMPLIANCE WITH LAW
          </h4>
          <p className='text-[13px] leading-6'>
            Vendor’s performance of work hereunder and all products and
            materials to be delivered hereunder shall be in accordance with any
            and all applicable US and Nigeria Executive Orders, Federal, State,
            Municipal, and Local Laws and Ordinances, and rules, orders,
            requirements and regulations. Such US Federal laws shall include,
            but not be limited to, the Fair Labor Standards Act of 1938 as
            amended, E.O. 11246, “Equal Opportunity,” as amended by E.O. 11375,
            “Amending Executive Order 11246 Relating to Equal Employment
            Opportunity,” and as supplemented by regulations at 41 CFR Chapter
            60, “Office of Federal Contract Compliance Programs, Equal
            Employment Opportunity, Department of Labor”, the Copeland
            “Anti-Kickback” Act (18USC874 and 40USC276c and 18USC874 as
            supplemented by Department of Labor regulations at 29CFRpart 3, the
            Davis-Bacon Act, as amended (40USC276a-a7) and as supplemented by
            Department of Labor at 29CFRpart 5, the Contract Work Hours and
            Safety Standards Act (40USC327-333), and the Byrd Anti-Lobbying
            Amendment (31USC1352). Unless otherwise agreed, governing law shall
            be the common law of the operating country.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            4. DELIVERY INSPECTION
          </h4>
          <ol>
            <li className='text-[13px] leading-6'>
              (a) Vendor shall work within professional standards and
              limitations specified on work statements, drawings and
              specifications covering the work and shall make such inspections
              as are deemed necessary to ensure Vendor compliance, unless
              deviation there from is authorized in writing by AHNi.
            </li>
            <li className='text-[13px] leading-6'>
              (b) All shipments of materials shall be subject to final
              inspection by AHNi after receipt by AHNi at listed destination. If
              material supplied or work performed or services rendered by Vendor
              is found to be defective, Vendor shall be given the opportunity to
              correct any deficiencies within a reasonable period. If correction
              of such work is impracticable, Vendor shall bear all risk after
              notice of rejection and shall, if so requested by AHNi and at its
              own expense, promptly make all necessary replacements.
            </li>
            <li className='text-[13px] leading-6'>
              (c) Final inspection and acceptance by AHNi shall be conclusive
              except for latent defects, fraud, or for any rights provided by
              any product warranty.
            </li>
          </ol>

          <h4 className='text-[14px] font-bold underline my-3'>
            5. PURCHASE ORDERS ACCEPTANCE AND ACKNOWLEDGEMENT:
          </h4>
          <p className='text-[13px] leading-6'>
            The Purchase Order shall not become effective until these Purchase
            Order Terms and Conditions are signed by Vendor and authorized
            representatives of both parties have signed the Purchase Order.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            6. TAX DEDUCTIONS AND EXAMPTION:
          </h4>
          <p className='text-[13px] leading-6'>
            AHNi is Value Added Tax (VAT) exempted but deduct at source
            Withholding Tax (WHT) and remit to relevant Tax authorities in line
            with relevant Nigerian Tax laws. This WHT is usually netted out of
            Gross value of the Purchase Order except where it has been
            established that such materials supply services or works are
            exempted in accordance with the Tax laws of the Federal Republic of
            Nigeria.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            7. DEFECT LIABILITY AND WARRANTY:
          </h4>
          <ol>
            <li className='text-[13px] leading-6'>
              (a)AHNi has the right to inspect and test all supplies, equipment
              and services quantity and quality of delivery required for by the
              Purchase Order, to the extent practicable, at all places and
              times, including the period of manufacture, seller’s warehouse and
              in any event before acceptance. AHNi shall perform inspections and
              tests in a manner that will not unduly delay the work. AHNi
              assumes no contractual obligation to perform any inspection and
              test for the benefit of the Vendor.
            </li>
            <li className='text-[13px] leading-6'>
              (b) AHNi shall inspect the items upon their delivery (if different
              not agreed) and provide written notice to Vendor as to any
              defects, non-conformities, or issues in Vendor’s performance of
              its contract obligations.
            </li>
            <li className='text-[13px] leading-6'>
              (c)Vendor must be present during AHNi quantitative and quality
              control process to be undertaken at the time of delivery. If
              Vendor does not attend, Vendor accepts the quantitative and
              qualitative control outcome performed by AHNi.
            </li>
            <li className='text-[13px] leading-6'>
              (d) AHNi shall not be obliged to buy or pay for, and AHNi may at
              any time after delivery reject, all or any part of a given
              delivery of goods and services that AHNi determines does not
              conform to the Contract, is defective in material or workmanship,
              or are otherwise not in conformity with the contract
              specifications
            </li>

            <li className='text-[13px] leading-6'>
              (e)Vendor shall remove items rejected or required to be corrected
              at its sole cost, including Vendor solely bearing the costs for
              re-loading cargo following a negative inspection. However, AHNi
              may require or permit correction in place, promptly after notice,
              by and at the expense of the Vendor. The Vendor shall not tender
              for acceptance corrected or rejected supplies without disclosing
              the former rejection or requirement for correction, and, when
              required, shall disclose the corrective action taken.
            </li>

            <li className='text-[13px] leading-6'>
              (f) If Vendor fails to promptly remove, replace, or correct
              rejected items that are required to be removed or to be replaced
              or corrected, AHNi may either (1) by contract or otherwise,
              remove, replace, or correct the items and charge the cost to the
              Vendor or (2) terminate the contract for default. Unless the
              Vendor corrects or replaces the supplies within the delivery
              schedule, AHNi may require their delivery and make an equitable
              price reduction or request reimbursement if funds advanced.
            </li>

            <li className='text-[13px] leading-6'>
              (g)Vendor is exclusively liable for any defects in the items by
              Vendor, its agents, representatives, or subcontractors. Vendor
              hereby agrees to indemnify AHNi for any losses, damages or claims
              of any kind arising from such defects.
            </li>

            <li className='text-[13px] leading-6'>
              (h) AHNi’s failure to inspect and accept or reject the supplies
              shall not relieve the Vendor from responsibility, nor impose
              liability on AHNi, for nonconforming items. Inspections and tests
              by AHNi do not relieve the Vendor of responsibility for defects or
              other failures to meet Contract requirements.
            </li>
          </ol>
        </div>
        <div className='flex-1  space-y-2'>
          <h4 className='text-[14px] font-bold underline mb-3'>
            8. ANTI-CORRUPTION/ ANTI-FRAUD:
          </h4>
          <p className='text-[13px] leading-6'>
            Vendor shall ensure that it and its directors, officers, employees,
            partners and Vendors do not engage in any corrupt practice
            (including offering, giving, receiving or soliciting anything of
            value to influence the actions of any public official or any AHNi
            officer or employee) or any fraudulent practice (including
            misrepresentation of facts in any transaction or report). Vendor
            represents and warrants that no staff of AHNi has been, or shall be,
            offered by Vendor any direct or indirect benefit arising from this
            Purchase Order or the award thereof. Vendor agrees that breach of
            this provision constitutes a is breach of an essential term of this
            Purchase Order.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            9. FORCE MAJEURE:
          </h4>

          <p className='text-[13px] leading-6'>
            Force Majeure” is any event that could not be foreseen, avoided or
            eliminated, including fire, flood, or other natural disaster,
            changes in the law, adverse government actions, industrial
            disturbances, war, unrest, explosions and any other similar
            circumstances. As soon as possible, but no longer than fifteen (15)
            days, after a Force Majeure occurrence, Vendor shall provide AHNi
            with notice and complete and accurate details, in writing, of such
            an occurrence. If Vendor is thereby unable, wholly or in part, to
            perform its obligations and/or meet its responsibilities under this
            Purchase Order, AHNi shall have the right to cancel the Purchase
            Order, in writing, with seven (7) days’ notice of termination to
            Vendor.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            10. STOP WORK AND TERMINATION
          </h4>

          <ol>
            <li className='text-[13px] leading-6'>
              (a) AHNi shall have the right to direct Vendor to stop work at any
              time. Such direction must be in writing and shall be effective for
              a period of not morethan 30 days after which time Vendor may
              continue work absent direction to do so or a notice of
              termination.
            </li>

            <li className='text-[13px] leading-6'>
              (b) This Purchase Order may be terminated upon default of either
              party in meeting its obligations hereunder.
            </li>
            <li className='text-[13px] leading-6'>
              (c) This Purchase Order may be terminated for convenience, without
              fault of either party, by AHNi with advance written notice to the
              Vendor. Vendor shall be paid for work completed and shall be
              reimbursed all actual costs for work in process incurred to time
              of termination notification inclusive of any associated
              administrative costs, restocking charges, Vendor cancellation
              charges and settlement costs. Under no circumstances shall Vendor
              receive more than the original value of this Purchase Order.
            </li>

            <li className='text-[13px] leading-6'>
              (d) This order may be terminated for constructive default if AHNi
              has reasonable cause to believe that the Vendor will not be able
              to perform in accordance with the terms and conditions of the
              Purchase Order. Vendor shall be given a reasonable opportunity to
              respond to a notice of constructive default termination. In the
              event of failure of the Vendor to deliver/complete any part of
              this order, then AHNi shall, at its sole discretion, have the
              right to accept any delivered/completed part and unilaterally
              reduce the agreed upon price accordingly.
            </li>
            <li className='text-[13px] leading-6'>
              (e) AHNi acceptance of partial deliveries shall not constitute a
              waiver of any of the Vendor’s remaining obligations hereunder.
            </li>

            <li className='text-[13px] leading-6'>
              (f) The preceding paragraph
            </li>

            <li className='text-[13px] leading-6'>
              (e) shall not limit any legal rights of either party to cancel
              this Purchase Order by reason of any default, and AHNi further
              reserves the right to cancel this Purchase Order without further
              liability for articles not accepted by AHNi in the event, the
              Vendor commits an act of bankruptcy, files or has filed against
              the petition of bankruptcy or insolvency or suffers any
              receivership or other similar petition to be filed for or against
              it.
            </li>
          </ol>

          <h4 className='text-[14px] font-bold underline my-3'>
            11. DRUG TRAFFICKING
          </h4>

          <p className='text-[13px] leading-6'>
            AHNi reserve the right to terminate this purchase order/subcontract
            to demand a refund or take other appropriate measures if the vendor
            is found to have been convicted of a narcotics offense or to have
            been engaged in drug trafficking as defined in 22 CFR Part 140.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            12. TERRORISM E. O. 13224:
          </h4>

          <p className='text-[13px] leading-6'>
            Vendor agrees and certifies to take all necessary actions to comply
            with Executive Order No. 13224 on Terrorist Financing; blocking and
            prohibiting transactions with persons who commit, threaten to
            commit, or support terrorism. (E.O.13224 text available at:
            <span className='text-blue-400'>
              http://www.whitehouse.gov/news/releases/2001/09/20010924-1.html
            </span>
            Note: Vendor is required to obtain the updated lists at the time of
            procurement of goods or services. The updated lists are available
            at:
            <span className='text-blue-400'>
              http://treasury.gov/offices/enforcement/ofac/sanctions/terrorism.htm
              and http://www.un.org/Docs/sc/committees/1267.
            </span>
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            13. LIQUIDATED DAMAGES AND PENALTIES
          </h4>
          <p className='text-[13px] leading-6'>
            Liquidate Damage Clause shall apply if the Vendor fails to deliver
            goods, render services or perform works within the the delivery
            timeframe as specified in the Purchase Order, AHNi shall require
            that the Vendor pay, in place of actual damages, liquidated damage,
            an amount equivalent of one percent (1%) of gross value of the
            Purchase Order for each day of default. This liquidated damage
            clause shall be activated and effective after additional five (5)
            working days has been granted the Vendor in addition to initially
            listed delivery timeframe on the issued Purchase Order. If AHNi
            terminates this Purchase Order in part or whole as a result of
            default or failure to deliver or perform in part or whole as
            stipulated in the Purchase Order/Contract, Vendor is liable for
            liquidated damages accrual until such a time that AHNi reasonably
            obtains a delivery or performance from another Vendor. AHNi reserves
            the right to deduct at source all accruable amount in the form of
            Liquidated Damages from the Vendor’s outstanding invoice if any or
            request reimbursement.
          </p>
          <p className='text-[13px] leading-6'>
            This remedy is without prejudice to any others that may be available
            to AHNi, including cancellation, for Vendor’s non-performance,
            blacklisting as a result of breach or violation of any term or
            condition of the Purchase Order. Liquidated damaged is adjudged fair
            rather than punitive measure to cover for specific circumstances
            where AHNi faces a loss either in time or reputation in the cause of
            an award of goods, services or works Purchase Orders and/or Contract
            performance and shall have quantifiable direct monetary correlation
            to these losses incurred by AHNi both in time and reputation. Vendor
            will not be charged with liquidated damages when delay of delivery
            or performance is beyond the control and without the fault or
            negligence of the Vendor.
          </p>

          <h4 className='text-[14px] font-bold underline my-3'>
            14. DEBARMENT, SUSPENSION, INELIGIBILITY AND VOLUNTARY EXCLUSION
          </h4>
          <p className='text-[13px] leading-6'>
            Vendor certifies by acceptance of this Purchase Order that neither
            it nor its principals is presently debarred, suspended, proposed for
            debarment, declared ineligible, or voluntarily excluded from
            participation in this transaction by any U.S. Federal Government
            department or agency and the host government.
          </p>
        </div>
      </div>

      <div className='w-full flex justify-end my-8'>
        <Link href={RouteEnum.PURCHASE_ORDER} className=''>
          <Button>Purchase Order</Button>
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
