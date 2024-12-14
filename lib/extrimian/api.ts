import { EXTRIMIAN_CONFIG } from "./config";

interface PresentationRequest {
  did: string;
  to: string;
  inputDescriptors: {
    id: string;
    constraints: {
      fields: Array<{
        path: string[];
        id: string;
        purpose: string;
        filter: {
          type: string;
          const: any;
        };
      }>;
    };
  };
}

interface PresentationResponse {
  oobContentData: string;
  invitationId: string;
}

interface DIDResolutionResponse {
  "@context": string[];
  id: string;
  verificationMethod: Array<{
    id: string;
    controller: string;
    type: string;
    publicKeyJwk: {
      kty: string;
      crv: string;
      x: string;
      y: string;
    };
  }>;
  keyAgreement: string[];
  assertionMethod: string[];
}

export class ExtrimianAPI {
  private static async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT",
    body?: any
  ) {
    const url = `/api/extrimian${endpoint}`;
    console.log("Making request to:", url);
    console.log("Request body:", body);

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        mode: "cors",
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  static async requestPresentation(
    verifierDID: string
  ): Promise<PresentationResponse> {
    const params: PresentationRequest = {
      did: verifierDID, // Use the DID created by this API instance
      to: "",
      inputDescriptors: {
        id: "residency_check",
        constraints: {
          fields: [
            {
              path: ["$.type"],
              id: "type",
              purpose: "Check credential type",
              filter: {
                type: "string",
                const: "BuenosAiresCredential",
              },
            },
          ],
        },
      },
    };

    return await this.makeRequest(
      "/v1/credentialsbbs/waci/oob/presentation",
      "PUT", // Changed to PUT
      params
    );
  }

  static async resolveDID(did: string): Promise<DIDResolutionResponse> {
    const endpoint = `/v1/dids/quarkid/${did}`;
    return await this.makeRequest(endpoint, "GET");
  }

  static async testDIDCreation() {
    try {
      console.log("Testing DID resolution...");
      const response = await this.resolveDID(EXTRIMIAN_CONFIG.developerDid!);
      console.log("DID Resolution Success:", response);
      return response;
    } catch (error) {
      console.error("DID Resolution Failed:", error);
      throw error;
    }
  }
}
