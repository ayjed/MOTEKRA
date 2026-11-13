import { describe, expect, it } from "vitest";
import { validateInquiry, isEmail, projectTypes } from "@/lib/contact/schema";

const validBase = {
  name: "Jane Doe",
  email: "jane.doe@example.test",
  projectType: "web-development",
  message: "We need a complete redesign of our enterprise web platform.",
};

describe("validateInquiry() - Name validation", () => {
  it("accepts names at minimum length boundary (2 characters)", () => {
    const result = validateInquiry({ ...validBase, name: "Ed" });
    expect(result.errors.name).toBeUndefined();
    expect(result.data.name).toBe("Ed");
  });

  it("accepts names at maximum length boundary (100 characters)", () => {
    const longName = "A".repeat(100);
    const result = validateInquiry({ ...validBase, name: longName });
    expect(result.errors.name).toBeUndefined();
    expect(result.data.name).toBe(longName);
  });

  it("rejects names below 2 characters", () => {
    for (const shortName of ["", "A"]) {
      const result = validateInquiry({ ...validBase, name: shortName });
      expect(result.errors.name).toBe("Enter a name between 2 and 100 characters.");
    }
  });

  it("rejects names exceeding 100 characters", () => {
    const tooLong = "A".repeat(101);
    const result = validateInquiry({ ...validBase, name: tooLong });
    expect(result.errors.name).toBe("Enter a name between 2 and 100 characters.");
  });

  it("trims leading and trailing whitespace before evaluating length", () => {
    // Trims to valid length
    const trimmedValid = validateInquiry({ ...validBase, name: "   Jo   " });
    expect(trimmedValid.errors.name).toBeUndefined();
    expect(trimmedValid.data.name).toBe("Jo");

    // Whitespace-padded single character trims to 1 char (invalid)
    const trimmedTooShort = validateInquiry({ ...validBase, name: "   J   " });
    expect(trimmedTooShort.errors.name).toBe("Enter a name between 2 and 100 characters.");
    expect(trimmedTooShort.data.name).toBe("J");

    // Whitespace only trims to empty string (invalid)
    const whitespaceOnly = validateInquiry({ ...validBase, name: "     " });
    expect(whitespaceOnly.errors.name).toBe("Enter a name between 2 and 100 characters.");
    expect(whitespaceOnly.data.name).toBe("");

    // 102 characters with padding that trim to 100 characters
    const padded100 = " " + "A".repeat(100) + " ";
    const trimmedPadded = validateInquiry({ ...validBase, name: padded100 });
    expect(trimmedPadded.errors.name).toBeUndefined();
    expect(trimmedPadded.data.name).toHaveLength(100);
  });

  it("rejects missing, null, undefined, and non-string name values", () => {
    const testCases: Record<string, unknown>[] = [
      { ...validBase, name: undefined },
      { ...validBase, name: null },
      { ...validBase, name: 12345 },
      { ...validBase, name: true },
      { ...validBase, name: ["Jane"] },
      { ...validBase, name: { first: "Jane" } },
    ];

    for (const testCase of testCases) {
      const result = validateInquiry(testCase);
      expect(result.errors.name).toBe("Enter a name between 2 and 100 characters.");
      expect(result.data.name).toBe("");
    }

    const omittedName = {
      email: validBase.email,
      projectType: validBase.projectType,
      message: validBase.message,
    };
    const omittedResult = validateInquiry(omittedName);
    expect(omittedResult.errors.name).toBe("Enter a name between 2 and 100 characters.");
    expect(omittedResult.data.name).toBe("");
  });

  it("rejects newlines, carriage returns, and control characters (ASCII 0-31)", () => {
    const maliciousNames = [
      "Jane\nDoe",
      "Jane\rDoe",
      "Jane\r\nBcc:attacker@example.test",
      "Jane\x00Doe",
      "Jane\x09Doe", // tab
      "Jane\x08Doe", // backspace
      "Jane\x1bDoe", // ESC
      "Jane\x1fDoe", // unit separator
    ];

    for (const name of maliciousNames) {
      const result = validateInquiry({ ...validBase, name });
      expect(result.errors.name).toBe("Enter a name between 2 and 100 characters.");
    }
  });

  it("accepts valid names with spaces, hyphens, apostrophes, and unicode accents", () => {
    const validNames = [
      "Jane Doe",
      "Mary-Jane O'Connor",
      "Dr. Alexis Smith-Jones Jr.",
      "René Descartes",
      "Ayomiposi Olorunjedalo",
      "Müller & Söhne",
    ];

    for (const name of validNames) {
      const result = validateInquiry({ ...validBase, name });
      expect(result.errors.name).toBeUndefined();
      expect(result.data.name).toBe(name);
    }
  });
});

describe("validateInquiry() - Email validation", () => {
  it("accepts valid email addresses and normalizes them to lowercase", () => {
    const testEmails = [
      ["USER@EXAMPLE.TEST", "user@example.test"],
      ["First.Last@Sub.Domain.Test", "first.last@sub.domain.test"],
      ["developer+filter@cloud.test", "developer+filter@cloud.test"],
      ["a.b.c@d.e.f.test", "a.b.c@d.e.f.test"],
      ["valid_email-123@example.co.uk", "valid_email-123@example.co.uk"],
    ];

    for (const [input, expectedNormalized] of testEmails) {
      const result = validateInquiry({ ...validBase, email: input });
      expect(result.errors.email).toBeUndefined();
      expect(result.data.email).toBe(expectedNormalized);
    }
  });

  it("trims surrounding whitespace from email and normalizes casing", () => {
    const result = validateInquiry({ ...validBase, email: "  User@Example.Test  " });
    expect(result.errors.email).toBeUndefined();
    expect(result.data.email).toBe("user@example.test");
  });

  it("rejects emails exceeding the RFC 5321 maximum length (254 characters)", () => {
    // 254 chars maximum valid structure
    const localPart = "a".repeat(64);
    // 64 + 1 (@) + 189 domain = 254
    const domainPart = "a".repeat(60) + "." + "a".repeat(60) + "." + "a".repeat(62) + ".test";
    const email254 = `${localPart}@${domainPart}`;
    expect(email254.length).toBe(254);
    expect(validateInquiry({ ...validBase, email: email254 }).errors.email).toBeUndefined();

    // 255 chars is rejected
    const email255 = "a".repeat(64) + "@" + "b".repeat(60) + "." + "b".repeat(60) + "." + "b".repeat(63) + ".test";
    expect(email255.length).toBe(255);
    const result = validateInquiry({ ...validBase, email: email255 });
    expect(result.errors.email).toBe("Enter a valid email address.");
  });

  it("rejects invalid email formats", () => {
    const invalidEmails = [
      "",
      "plainaddress",
      "@missinglocal.test",
      "missingdomain@",
      "missingdomain@.test",
      "missing-tld@domain",
      "user@domain@another.test",
      "user..name@example.test",
      ".leadingdot@example.test",
      "trailingdot.@example.test",
      "spaces in local@example.test",
      "user@spaces in domain.test",
      "user@-leadinghyphen.test",
      "user@trailinghyphen-.test",
      "user@exam_ple.test",
    ];

    for (const email of invalidEmails) {
      const result = validateInquiry({ ...validBase, email });
      expect(result.errors.email).toBe("Enter a valid email address.");
    }
  });

  it("rejects email header injection payloads containing CR or LF", () => {
    const injectionAttempts = [
      "victim@example.test\nBcc:attacker@example.test",
      "victim@example.test\rBcc:attacker@example.test",
      "victim@example.test\r\nCc:spam@example.test",
      "victim@example.test\nSubject:Injected",
    ];

    for (const email of injectionAttempts) {
      const result = validateInquiry({ ...validBase, email });
      expect(result.errors.email).toBe("Enter a valid email address.");
    }
  });

  it("rejects non-string email inputs", () => {
    const testCases = [undefined, null, 12345, true, ["user@example.test"], {}];

    for (const email of testCases) {
      const result = validateInquiry({ ...validBase, email });
      expect(result.errors.email).toBe("Enter a valid email address.");
      expect(result.data.email).toBe("");
    }
  });
});

describe("isEmail() - Direct standalone validation", () => {
  it("enforces local-part maximum length of 64 characters", () => {
    const local64 = "a".repeat(64) + "@example.test";
    const local65 = "a".repeat(65) + "@example.test";
    expect(isEmail(local64)).toBe(true);
    expect(isEmail(local65)).toBe(false);
  });

  it("rejects consecutive dots anywhere in the local part", () => {
    expect(isEmail("a..b@example.test")).toBe(false);
    expect(isEmail("first...last@example.test")).toBe(false);
    expect(isEmail("a.b.c@example.test")).toBe(true);
  });

  it("rejects leading and trailing dots in the local part", () => {
    expect(isEmail(".user@example.test")).toBe(false);
    expect(isEmail("user.@example.test")).toBe(false);
    expect(isEmail("u.s.e.r@example.test")).toBe(true);
  });

  it("rejects newline and carriage return characters", () => {
    expect(isEmail("user@example.test\n")).toBe(false);
    expect(isEmail("user\n@example.test")).toBe(false);
    expect(isEmail("user\r\n@example.test")).toBe(false);
  });

  it("accepts valid RFC special characters in local part", () => {
    const specials = "user!#$%&'*+/=?^_`{|}~-test@example.test";
    expect(isEmail(specials)).toBe(true);
  });

  it("handles malformed strings safely without throwing", () => {
    expect(isEmail("")).toBe(false);
    expect(isEmail("@")).toBe(false);
    expect(isEmail("@@")).toBe(false);
    expect(isEmail("a@b")).toBe(false);
  });
});

describe("validateInquiry() - Project type validation", () => {
  it("accepts every officially supported projectType in projectTypes array", () => {
    expect(projectTypes).toEqual([
      "ui-ux-design",
      "web-development",
      "mobile-app-development",
      "product-strategy",
      "brand-visual-design",
      "not-sure",
    ]);

    for (const projectType of projectTypes) {
      const result = validateInquiry({ ...validBase, projectType });
      expect(result.errors.projectType).toBeUndefined();
      expect(result.data.projectType).toBe(projectType);
    }
  });

  it("trims surrounding whitespace on valid project types", () => {
    const result = validateInquiry({ ...validBase, projectType: "  web-development  " });
    expect(result.errors.projectType).toBeUndefined();
    expect(result.data.projectType).toBe("web-development");
  });

  it("rejects unsupported strings, casing mismatches, and arbitrary values", () => {
    const invalidTypes = [
      "Web-Development",
      "UI-UX-DESIGN",
      "consulting",
      "seo-optimization",
      "unknown",
      "not_sure",
      "",
      "   ",
    ];

    for (const projectType of invalidTypes) {
      const result = validateInquiry({ ...validBase, projectType });
      expect(result.errors.projectType).toBe("Choose a project area, or select Not sure yet.");
    }
  });

  it("rejects missing, null, undefined, and non-string projectType values", () => {
    const invalidValues = [undefined, null, 123, true, ["web-development"], {}];

    for (const projectType of invalidValues) {
      const result = validateInquiry({ ...validBase, projectType });
      expect(result.errors.projectType).toBe("Choose a project area, or select Not sure yet.");
      expect(result.data.projectType).toBe("");
    }

    const omittedType = {
      name: validBase.name,
      email: validBase.email,
      message: validBase.message,
    };
    const omittedResult = validateInquiry(omittedType);
    expect(omittedResult.errors.projectType).toBe("Choose a project area, or select Not sure yet.");
    expect(omittedResult.data.projectType).toBe("");
  });
});

describe("validateInquiry() - Message validation", () => {
  it("accepts messages at the 20-character lower boundary", () => {
    const exact20 = "A".repeat(20);
    const result = validateInquiry({ ...validBase, message: exact20 });
    expect(result.errors.message).toBeUndefined();
    expect(result.data.message).toBe(exact20);
  });

  it("accepts messages at the 5,000-character upper boundary", () => {
    const exact5000 = "A".repeat(5000);
    const result = validateInquiry({ ...validBase, message: exact5000 });
    expect(result.errors.message).toBeUndefined();
    expect(result.data.message).toBe(exact5000);
  });

  it("rejects messages below 20 characters", () => {
    const shortMessages = ["", "A", "Short message.", "1234567890123456789"]; // 19 chars
    for (const message of shortMessages) {
      const result = validateInquiry({ ...validBase, message });
      expect(result.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");
    }
  });

  it("rejects messages exceeding 5,000 characters", () => {
    const tooLong = "A".repeat(5001);
    const result = validateInquiry({ ...validBase, message: tooLong });
    expect(result.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");
  });

  it("trims leading and trailing whitespace before validating message length", () => {
    // 20 chars with surrounding whitespace trims to 20 -> accepted
    const padded20 = "   " + "A".repeat(20) + "   ";
    const validResult = validateInquiry({ ...validBase, message: padded20 });
    expect(validResult.errors.message).toBeUndefined();
    expect(validResult.data.message).toBe("A".repeat(20));

    // 19 chars padded with whitespace trims to 19 -> rejected
    const padded19 = "   " + "A".repeat(19) + "   ";
    const invalidResult = validateInquiry({ ...validBase, message: padded19 });
    expect(invalidResult.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");

    // Whitespace only (even > 20 spaces) trims to empty string -> rejected
    const whitespaceOnly = " ".repeat(30);
    const wsResult = validateInquiry({ ...validBase, message: whitespaceOnly });
    expect(wsResult.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");
    expect(wsResult.data.message).toBe("");
  });

  it("permits multiline messages with newlines, carriage returns, and horizontal tabs", () => {
    const multilineMessage =
      "Hello MOTEKRA Team,\n\nWe would like to request a proposal for:\n\t1. Design System\n\t2. Mobile App\r\nLooking forward to speaking.";
    expect(multilineMessage.length).toBeGreaterThanOrEqual(20);

    const result = validateInquiry({ ...validBase, message: multilineMessage });
    expect(result.errors.message).toBeUndefined();
    expect(result.data.message).toBe(multilineMessage);
  });

  it("rejects disallowed control characters embedded in message (ASCII 0-8, 11-12, 14-31)", () => {
    const disallowedCodes = [
      0, // null byte
      7, // BEL
      8, // backspace
      11, // vertical tab (\v)
      12, // form feed (\f)
      14, // shift out
      27, // escape
      31, // unit separator
    ];

    for (const code of disallowedCodes) {
      const message = "A".repeat(15) + String.fromCharCode(code) + "B".repeat(15);
      const result = validateInquiry({ ...validBase, message });
      expect(result.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");
    }
  });

  it("rejects missing, null, undefined, and non-string message values", () => {
    const invalidValues = [undefined, null, 12345678901234567890, true, ["message"], {}];

    for (const message of invalidValues) {
      const result = validateInquiry({ ...validBase, message });
      expect(result.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");
      expect(result.data.message).toBe("");
    }

    const omittedMsg = {
      name: validBase.name,
      email: validBase.email,
      projectType: validBase.projectType,
    };
    const omittedResult = validateInquiry(omittedMsg);
    expect(omittedResult.errors.message).toBe("Tell us about your project in 20 to 5,000 characters.");
    expect(omittedResult.data.message).toBe("");
  });
});

describe("validateInquiry() - Result consistency, multi-error reporting and immutability", () => {
  it("returns completely sanitized and normalized data on valid submission with empty errors object", () => {
    const input = {
      name: "  Alex Mercer  ",
      email: "  Alex.Mercer@Example.TEST  ",
      projectType: "  mobile-app-development  ",
      message: "  We are developing a high-performance cross-platform mobile application.  ",
    };

    const { data, errors } = validateInquiry(input);

    expect(errors).toEqual({});
    expect(data).toEqual({
      name: "Alex Mercer",
      email: "alex.mercer@example.test",
      projectType: "mobile-app-development",
      message: "We are developing a high-performance cross-platform mobile application.",
    });
  });

  it("reports field-specific errors independently when only one field is invalid", () => {
    // Only name invalid
    const badName = validateInquiry({ ...validBase, name: "X" });
    expect(badName.errors).toEqual({
      name: "Enter a name between 2 and 100 characters.",
    });

    // Only email invalid
    const badEmail = validateInquiry({ ...validBase, email: "invalid-email" });
    expect(badEmail.errors).toEqual({
      email: "Enter a valid email address.",
    });

    // Only projectType invalid
    const badType = validateInquiry({ ...validBase, projectType: "invalid-area" });
    expect(badType.errors).toEqual({
      projectType: "Choose a project area, or select Not sure yet.",
    });

    // Only message invalid
    const badMessage = validateInquiry({ ...validBase, message: "Too short" });
    expect(badMessage.errors).toEqual({
      message: "Tell us about your project in 20 to 5,000 characters.",
    });
  });

  it("simultaneously reports errors for all four fields when all inputs are invalid", () => {
    const allInvalid = {
      name: "",
      email: "bad-email",
      projectType: "unsupported",
      message: "too short",
    };

    const { errors, data } = validateInquiry(allInvalid);

    expect(errors).toEqual({
      name: "Enter a name between 2 and 100 characters.",
      email: "Enter a valid email address.",
      projectType: "Choose a project area, or select Not sure yet.",
      message: "Tell us about your project in 20 to 5,000 characters.",
    });
    expect(Object.keys(errors)).toHaveLength(4);
    expect(data.name).toBe("");
    expect(data.email).toBe("bad-email");
    expect(data.projectType).toBe("unsupported");
    expect(data.message).toBe("too short");
  });

  it("does not mutate the supplied input object (enforced with Object.freeze)", () => {
    const input = Object.freeze({
      name: "  Unmutated User  ",
      email: "  USER@EXAMPLE.TEST  ",
      projectType: "  product-strategy  ",
      message: "  This is an input object that must never be mutated during validation.  ",
    });

    expect(() => validateInquiry(input)).not.toThrow();

    const result = validateInquiry(input);
    expect(result.data.name).toBe("Unmutated User");
    expect(result.data.email).toBe("user@example.test");
    expect(result.data.projectType).toBe("product-strategy");
    expect(result.data.message).toBe("This is an input object that must never be mutated during validation.");
    expect(result.errors).toEqual({});

    // Verify original object was untouched
    expect(input.name).toBe("  Unmutated User  ");
    expect(input.email).toBe("  USER@EXAMPLE.TEST  ");
  });

  it("safely handles extra unknown properties in the input record without polluting data", () => {
    const inputWithExtra = {
      ...validBase,
      extraField: "malicious payload",
      companyWebsite: "bot-honeypot",
    };

    const { data, errors } = validateInquiry(inputWithExtra);
    expect(errors).toEqual({});
    expect(data).toEqual({
      name: validBase.name,
      email: validBase.email,
      projectType: validBase.projectType,
      message: validBase.message,
    });
    expect("extraField" in data).toBe(false);
    expect("companyWebsite" in data).toBe(false);
  });
});
