# Overview

Develop a dynamic form builder using Next.js (version 12.3.4), TypeScript, and [React Hook Form](https://github.com/react-hook-form/react-hook-form). The form should be rendered based on a predefined schema with variable configurations and demonstrate your ability to write dynamic, reusable, scalable, and extensible UI components.

## Objectives

### 1. Form Schema Definition

- Utilize the `FormField` type and `FormFieldType` enum from `src/models/form.ts` to define a form schema.
- Your form should support all field types defined in `FormFieldType`.

### 2. Dynamic Form Rendering

- Implement the `FormBuilder` component in `src/components/FormBuilder/FormBuilder.tsx`.
- Implement necessary supporting components.
- Dynamically render form fields based on the `fields` prop using [React Hook Form](https://github.com/react-hook-form/react-hook-form).
- Ensure each form field supports the attributes and validation specified in the `FormField` interface.

### 3. Form Validation and Submission

- Implement an `onSubmit` function in `src/pages/index.tsx` that logs form values to the console.
- Include appropriate validation handling based on the schema.

### 4. **Bonus:** UI/UX Design

- Ensure that the webpage and form are responsive and adapt to different screen sizes, especially mobile devices.
- Use SCSS or a UI framework / library of your choice for styling.

### 5. **Bonus:** Retrieve Form Field Config from API

- Create a mock API endpoint within the Next.js project to serve form field configurations.
- Modify the `src/pages/index.tsx` to retrieve form configurations from this API.

### 6. **Bonus:** Form Submission to API

- Implement a mock API endpoint for form submission within the Next.js project.
- Modify the form submission logic to POST the form data to this API.
- In the API handler, log the received form data to simulate saving and return a mock response.

## Requirements

- TypeScript and ES6+ code.
- Emphasis on maintainability and understandable code structure.
- Flexibility to modify the provided starter code.
- Option to use additional libraries to complete the task.

## Evaluation Criteria

- Functionality: The form should be fully functional and meet all objectives and requirements.
- Reusability and Scalability: Components should be designed for reusability, extensibility and scalability.
- Responsiveness: The webpage should be responsive and mobile-friendly.
- Code Quality: Code should be clean, well-organized, and follow best practices.
- UI Design (Plus, not primary): A user-friendly and aesthetically pleasing UI is a plus, but the primary focus is on functionality and code quality.
- API Interaction (Bonus): Ability to interact with APIs for fetching form configurations and submitting data.
