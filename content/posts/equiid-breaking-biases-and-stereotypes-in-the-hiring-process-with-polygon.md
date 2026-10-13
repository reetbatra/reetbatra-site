---
title: "EquiID: Breaking Biases and Stereotypes in the Hiring Process with Polygon"
date: "2023-06-06"
brief: "EquiID is our project developed during the wmn; 2023 hackathon that aims to revolutionize the hiring process by eliminating biased and stereotype-reinforcing fields in traditional…"
topic: protocols
original: "https://reet.hashnode.dev/equiid-breaking-biases-and-stereotypes-in-the-hiring-process-with-polygon"
---

EquiID is our project developed during the wmn; 2023 hackathon that aims to revolutionize the hiring process by eliminating biased and stereotype-reinforcing fields in traditional job applications. By employing decentralized technologies and NFTs, EquiID focuses on an applicant's skills and qualifications, fostering fairness and equal opportunities for all individuals, regardless of their gender, nationality, or other personal factors.

### Problem Statement

The existing hiring process is plagued by biases against specific groups of people, such as women, people of color, individuals from certain countries, or those belonging to particular age groups. These biases often lead to unfair judgments and perpetuate stereotypes, resulting in an inequitable hiring process. Furthermore, pay is frequently determined based on these irrelevant factors, rather than the applicant's skills and qualifications.

### Solution: EquiID

EquiID addresses this issue by collecting pertinent applicant details and securely storing and verifying their previous pay slips. Instead of disclosing exact salary figures, EquiID provides a non-fungible token (NFT) that indicates only the range of their previous pay. This enables employers to assess candidates solely based on their abilities, without being influenced by personal information that could trigger bias or discrimination.

### Technical Components of EquiID

**1\. Secure storage and verification of previous pay slips and ID proof:** EquiID uses decentralized storage solutions like IPFS to securely store and verify applicants' pay slips, ensuring that employers have accurate information about candidates' previous salary ranges without revealing specific figures that could lead to biases. We have used Lighthouse Storage for encryption of the documents and access control.

**2\. NFT-based salary range representation:** EquiID utilizes NFTs, created using Solidity smart contracts, to represent applicants' salary ranges. This approach allows employers to evaluate candidates based on their skills and qualifications without being influenced by potentially biased information.

**3\. Integration with existing hiring platforms:** Employers will have to add a connect wallet button in their job application form to get the candidate's verified wallet address, then through our contract on Polygon and opensea the NFT that the candidate holds can be easily verified.

**4\. Optical character recognition (OCR):** Tesseract OCR is used to extract information from pay slips and ID proof submitted, automating the process of verifying previous salary ranges and ensuring accuracy.

**5\. Backend development and deployment:** The backend of EquiID is developed using Node.js and hosted on DigitalOcean.

**6\. Blockchain integration:** Hardhat simplifies smart contract development and deployment, including integration with Polygon. With Hardhat, we tested and debugged our contracts and tried to achieve gas optimization.

*Some of the technologies used in the development of EquiID include:*

***1\. Solidity:*** For smart contract development.

***2\. React:*** For building the frontend user interface.

***3\. Multer:*** For handling file uploads and storage.

***4\. Tesseract OCR:*** For optical character recognition to extract information from pay slips.

***5\. Tailwind CSS:*** For styling the frontend components.

***6\. Chakra UI:*** For creating a smoother and easy UI.

***7\. DigitalOcean:*** For deployment and hosting.

***8\. Node.js:*** For backend development.

***9\. Polygon:*** For deploying smart contracts.

***10\. IPFS/Filecoin:*** For decentralized storage.

***11\. Lighthouse:*** For integrating IPFS in an easy manner.

### Challenges and Lessons Learned

During the development of EquiID, our team faced several challenges, such as deploying the project on DigitalOcean and integrating the backend with the front end. Additionally, we encountered difficulties in implementing OCR technology for extracting information from pay slips. However, with the help of mentors and continuous learning, we overcame these obstacles and successfully developed a functional platform.

EquiID is an innovative solution that leverages NFTs and decentralized technologies to tackle biases and stereotypes in the hiring process. By focusing on skills and qualifications and eliminating unnecessary personal information, EquiID promotes fairness and equal opportunities for all individuals, regardless of their gender or nationality.

As the project continues to evolve, we aim to refine the platform and expand its capabilities to further support equitable hiring practices. By collaborating with employers, applicants, and other stakeholders, we can create a more inclusive and diverse workforce that values talent and skills above all else.

To know more about the project, check our devfolio page [here](https://devfolio.co/projects/equiid-66ab).

![](/writing/equiid-breaking-biases-and-stereotypes-in-the-hiring-process-with-polygon/01-57ff05.webp)

### Sharing my experience on participating in a women-only hackathon:

The experience of participating in a women-only hackathon was truly empowering and eye-opening. It provided an opportunity to witness firsthand the gender disparities that exist within the tech industry and to actively work towards making a positive impact.

One of the most noticeable aspects of the women-only hackathon was the absence of interruptions and the opportunity for every participant to have their voice heard. In male-dominated spaces, women often face challenges in having their ideas recognized and respected. However, during the hackathon, the atmosphere was different. Everyone had the freedom to express their thoughts and contribute to the team's project without the fear of being talked over or ignored. This created a supportive and inclusive environment where collaboration and teamwork thrived.

![](/writing/equiid-breaking-biases-and-stereotypes-in-the-hiring-process-with-polygon/02-72a272.webp)

Moreover, the mentors and judges at the women-only hackathon were incredibly kind, supportive, and helpful. They understood the importance of providing guidance and encouragement to women in tech and went above and beyond to ensure that all participants had access to the resources and assistance they needed.

Another inspiring aspect of the women-only hackathon was the passion and dedication displayed by the participants. Many individuals traveled solo, leaving behind their comfort zones and stepping into a new and unfamiliar environment. The hackathon became a platform for collaboration, knowledge sharing, and networking, allowing participants to form connections with like-minded individuals and build a supportive community.

Participating in a women-only hackathon also shed light on the importance of diversity in the tech industry. The event highlighted the need to create spaces where non-binary and female individuals can thrive, share their unique perspectives, and contribute their talents. By providing a supportive environment for underrepresented groups, we can encourage their participation and ensure that their voices are heard and valued.

Overall, the experience at the women-only hackathon was transformative. It was my first in-person hackathon as well and I met my teammates during the hackathon and we are friends outside work now!

By continuing to participate in such events and fostering a sense of community and support, we can collectively work towards a more inclusive and diverse tech industry that celebrates the talents and contributions of individuals from all backgrounds.
