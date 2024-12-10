
# AI Twin Public-Facing App (Open Source)

Welcome to the **AI Twin Public-Facing App**, an open-source project by **Prifina**. This app serves as the public-facing interface for AI twins, allowing for customizable, branded, and seamless interactions between AI twin owners and their audiences.

Built using **Next.js** and **Chakra UI**, the app is designed to be lightweight, scalable, and developer-friendly, with seamless integration to Prifina's middleware and backend systems.

---

## Overview

This app is part of the Prifina AI Twin ecosystem, consisting of:

1. **Owner's Base App**: A private admin tool for managing the AI twin's knowledge, settings, and insights.
2. **Public-Facing AI Twin App**: A lightweight, independent app where audiences interact with the AI twin via a unique URL for each AI twin.
3. **Middleware**: Connects the public-facing app to Prifina’s backend, handling data flows, privacy and maintaining smooth functionality.

This repository provides an **open-source version** of the Public-Facing AI Twin App, enabling **Prifina partners** to customize, brand, and host their own versions.

### Example
Try a live example of a public-facing AI twin:  
[Valto AI](https://hey.speak-to.ai/valto) - CXO at Prifina.

---

## Key Features

- **Built with Next.js**: A modern React-based framework optimized for performance, SEO, and scalability.
- **UI Powered by Chakra UI**: Modular, accessible, and themeable UI components.
- **Customizable Branding**: Easily modify visual styles, add logos, and adjust navigation.
- **Middleware Integration**: Core functionality is managed via Prifina’s middleware, ensuring reliable performance.
- **Multi-Domain Hosting**: Partners can deploy customized versions under their own domains for a cohesive brand identity.

Learn more about **AI Twins** at [About AI Twins](https://www.prifina.com/about-ai-twins.html).

---

## Customization Options

You have full control over the app's appearance and branding while retaining core functionality. Customization includes:

- **Themes and Colors**: Use Chakra UI’s theme support to apply custom colors and typography.
- **Logos and Visual Elements**: Replace default assets in the `public/` folder.
- **Additional Links**: Add links and resources relevant to your use case.
- **Domains**: Host the app under your own domain or subdomain.

### Build Beyond Basics
Partners can build additional features or extend the app to suit their needs. However, modifications must:
1. Not "break" the app or introduce vulnerabilities or sneaky practices.
2. Ensure compliance with Prifina's existing **[General User Terms](https://www.prifina.com/ai-twin-general-user-terms.html)** and **[General Privacy Policy](https://www.prifina.com/ai-twin-general-privacy-policy.html)**.
3. Provide updated customer-facing **Terms of Use** and **Privacy Terms** if their changes go beyond the basic functionality catered by Prifina.

---

## Getting Started

Follow these steps to set up, customize, and deploy the app.

### 1. Clone the Repository
Clone the repository and navigate to the project folder:
```bash
git clone https://github.com/prifina/twin-app.git
cd twin-app
```

### 2. Install Dependencies
Install the required packages:
```bash
npm install
```

### 3. Run Locally
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Connect to Middleware
Update the `config.js` file with your middleware endpoint and credentials. This ensures the app integrates with Prifina’s backend.

### 5. Customize the App
Modify the following files to suit your needs:
- **Theme**: Update `theme.js` to adjust Chakra UI settings.
- **Branding**: Replace assets in the `public/` folder.
- **Pages**: Edit or add pages in the `pages/` directory.

### 6. Build and Deploy
Build the app for production:
```bash
npm run build
```
Deploy using your preferred platform:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom Hosting**

---

## Best Practices for Customization

1. **Retain Core Functionality**:
   - Do not alter the middleware integration logic to ensure compatibility with Prifina’s backend.
2. **Use Chakra UI**:
   - Leverage Chakra’s modular components to maintain consistency and accessibility.
3. **Test Before Deployment**:
   - Verify middleware connections, UI responsiveness, and interaction flows in staging before production deployment.
4. **Secure Your Deployment**:
   - Use HTTPS for secure communication.
   - Ensure proper domain and server configurations.

---

## Support and Services

Prifina offers flexible support options for customization:

1. **In-House Development**:
   - Partners can use their own developers to customize the app.

2. **Outsourced Development**:
   - Partners can work with any external development team of their choice.

3. **Prifina Assistance**:
   - Prifina can recommend suitable developers for your project.
   - In some cases, Prifina can provide direct customization services at an additional cost.

### Developer Sign-Up
Developers who wish to contribute to Prifina projects or provide customization services to partners can register at:  
[https://www.prifina.com/developer-sign-up.html](https://www.prifina.com/developer-sign-up.html)

For inquiries, contact us at **support@prifina.com**.

---

## Technical Details

- **Framework**: Next.js
- **UI Library**: Chakra UI
- **State Management**: Context API
- **Middleware Integration**: REST API via Prifina Middleware
- **Hosting Compatibility**: Works with Vercel, Netlify, AWS, or any static hosting provider.

---

## FAQs

**Q: Can I host the app on my own domain?**  
A: Yes, the app can be deployed under any domain or subdomain of your choice.

**Q: What customizations are allowed?**  
A: You can customize visuals, navigation, and branding, but middleware integration must remain intact. Additional features must follow the guidelines in the customization section.

**Q: How do updates work?**  
A: Partners are responsible for pulling the latest updates from this repository and merging them into their custom versions.

**Q: Does Prifina offer customization services?**  
A: Yes, Prifina can assist with customization for an additional fee or recommend developer partners.

---

## Contribution

We welcome contributions from the community! To contribute:

1. Fork this repository.
2. Create a feature branch.
3. Submit a pull request for review.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## About Prifina

**The User-Held Data Company**  
Prifina is a venture-backed data platform based in San Francisco dedicated to enabling Personal AI Twins and personal data ownership. Prifina empowers individuals to collect, combine, and leverage their personal information, giving them full control over their digital lives. Consumer brands and developers can create AI agents and apps that deliver personalized customer experiences while ensuring users retain ownership and control over their data.

Learn more at [www.prifina.com](https://www.prifina.com).
