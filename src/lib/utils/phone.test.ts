import { describe, expect, it } from "vitest";
import {
  formatPhoneInternational,
  formatPhoneNational,
  isValidBrazilianPhone,
  normalizePhone,
  parseBrazilianPhone,
  stripCountryCode,
} from "./phone";

describe("stripCountryCode", () => {
  it("remove 55 quando há 12–13 dígitos", () => {
    expect(stripCountryCode("5511999990001")).toBe("11999990001");
    expect(stripCountryCode("5527999990000")).toBe("27999990000");
  });

  it("não remove 55 quando é DDD (10–11 dígitos)", () => {
    expect(stripCountryCode("55999990001")).toBe("55999990001");
    expect(stripCountryCode("5512345678")).toBe("5512345678");
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

describe("normalizePhone", () => {
  it("normaliza entrada nacional", () => {
    expect(normalizePhone("(27) 99999-0000")).toBe("5527999990000");
  });

  it("não duplica DDI 55", () => {
    expect(normalizePhone("5511999990001")).toBe("5511999990001");
  });

  it("preserva DDD 55 corretamente", () => {
    expect(normalizePhone("55999990001")).toBe("5555999990001");
  });
});

describe("formatPhoneNational", () => {
  it("formata celular", () => {
    expect(formatPhoneNational("27999990000")).toBe("(27) 99999-0000");
  });

  it("formata valor salvo com DDI para edição", () => {
    expect(formatPhoneNational("5511999990001")).toBe("(11) 99999-0001");
  });
});

describe("formatPhoneInternational", () => {
  it("formata número armazenado", () => {
    expect(formatPhoneInternational("5527999990000")).toBe(
      "+55 (27) 99999-0000"
    );
  });

  it("formata fixo armazenado", () => {
    expect(formatPhoneInternational("552733334444")).toBe(
      "+55 (27) 3333-4444"
    );
  });
});
