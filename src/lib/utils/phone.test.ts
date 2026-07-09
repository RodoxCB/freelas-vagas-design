import { describe, expect, it } from "vitest";
import { detectCountryFromStored } from "@/lib/phone/countries";
import {
  formatPhoneInternational,
  formatPhoneNational,
  isValidBrazilianPhone,
  isValidPhone,
  normalizePhone,
  parseBrazilianPhone,
  parseStoredPhone,
  stripCountryCode,
} from "./phone";

describe("stripCountryCode", () => {
  it("remove 55 quando há 12–13 dígitos", () => {
    expect(stripCountryCode("5511999990001", "55")).toBe("11999990001");
    expect(stripCountryCode("5527999990000", "55")).toBe("27999990000");
  });

  it("não remove 55 quando é DDD (10–11 dígitos)", () => {
    expect(stripCountryCode("55999990001", "55")).toBe("55999990001");
    expect(stripCountryCode("5512345678", "55")).toBe("5512345678");
  });
});

describe("parseBrazilianPhone", () => {
  it("parseia celular nacional", () => {
    expect(parseBrazilianPhone("(27) 99999-0000")).toEqual({
      ddd: "27",
      number: "999990000",
    });
  });

  it("parseia fixo nacional", () => {
    expect(parseBrazilianPhone("(27) 3333-4444")).toEqual({
      ddd: "27",
      number: "33334444",
    });
  });

  it("parseia com DDI 55", () => {
    expect(parseBrazilianPhone("5511999990001")).toEqual({
      ddd: "11",
      number: "999990001",
    });
  });

  it("parseia DDD 55 sem confundir com país", () => {
    expect(parseBrazilianPhone("55999990001")).toEqual({
      ddd: "55",
      number: "999990001",
    });
  });

  it("rejeita DDD inválido", () => {
    expect(parseBrazilianPhone("(00) 99999-0000")).toBeNull();
  });

  it("rejeita celular sem 9 na 3ª posição", () => {
    expect(parseBrazilianPhone("(11) 89999-0000")).toBeNull();
  });
});

describe("isValidBrazilianPhone", () => {
  it("aceita celular e fixo válidos", () => {
    expect(isValidBrazilianPhone("(27) 99999-0000")).toBe(true);
    expect(isValidBrazilianPhone("(27) 3333-4444")).toBe(true);
  });

  it("rejeita número incompleto", () => {
    expect(isValidBrazilianPhone("(27) 9999")).toBe(false);
  });
});

describe("parseStoredPhone", () => {
  it("detecta Brasil a partir de número salvo", () => {
    expect(parseStoredPhone("5511999990001")).toEqual({
      country: expect.objectContaining({ iso2: "BR", dialCode: "55" }),
      national: "11999990001",
    });
  });

  it("detecta EUA a partir de número salvo", () => {
    expect(parseStoredPhone("14155552671")).toEqual({
      country: expect.objectContaining({ iso2: "US", dialCode: "1" }),
      national: "4155552671",
    });
  });

  it("detecta Portugal a partir de número salvo", () => {
    expect(parseStoredPhone("351912345678")).toEqual({
      country: expect.objectContaining({ iso2: "PT", dialCode: "351" }),
      national: "912345678",
    });
  });
});

describe("detectCountryFromStored", () => {
  it("usa EUA como default para DDI 1", () => {
    const result = detectCountryFromStored("14155552671");
    expect(result?.country.iso2).toBe("US");
    expect(result?.national).toBe("4155552671");
  });
});

describe("isValidPhone", () => {
  it("aceita telefone brasileiro", () => {
    expect(isValidPhone("5527999990000")).toBe(true);
  });

  it("aceita telefone internacional", () => {
    expect(isValidPhone("14155552671")).toBe(true);
    expect(isValidPhone("351912345678")).toBe(true);
  });

  it("rejeita número internacional curto", () => {
    expect(isValidPhone("1415")).toBe(false);
  });
});

describe("normalizePhone", () => {
  it("normaliza entrada nacional BR", () => {
    expect(normalizePhone("(27) 99999-0000")).toBe("5527999990000");
  });

  it("não duplica DDI 55", () => {
    expect(normalizePhone("5511999990001")).toBe("5511999990001");
  });

  it("preserva DDD 55 corretamente", () => {
    expect(normalizePhone("55999990001")).toBe("5555999990001");
  });

  it("normaliza telefone dos EUA", () => {
    expect(normalizePhone("14155552671")).toBe("14155552671");
  });
});

describe("formatPhoneNational", () => {
  it("formata celular BR", () => {
    expect(formatPhoneNational("27999990000")).toBe("(27) 99999-0000");
  });

  it("formata valor salvo com DDI para edição BR", () => {
    expect(formatPhoneNational("5511999990001")).toBe("(11) 99999-0001");
  });

  it("formata número internacional de forma genérica", () => {
    expect(
      formatPhoneNational("4155552671", {
        iso2: "US",
        name: "Estados Unidos",
        dialCode: "1",
      })
    ).toBe("415 555 2671");
  });
});

describe("formatPhoneInternational", () => {
  it("formata número BR armazenado", () => {
    expect(formatPhoneInternational("5527999990000")).toBe(
      "+55 (27) 99999-0000"
    );
  });

  it("formata fixo BR armazenado", () => {
    expect(formatPhoneInternational("552733334444")).toBe(
      "+55 (27) 3333-4444"
    );
  });

  it("formata número internacional armazenado", () => {
    expect(formatPhoneInternational("14155552671")).toBe("+1 415 555 2671");
    expect(formatPhoneInternational("351912345678")).toBe("+351 912 345 678");
  });
});
