import { ethers } from "ethers";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
export interface AwsKmsSignerCredentials {
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
    region: string;
    keyId: string;
}
export declare class AwsKmsSigner extends ethers.Signer {
    kmsCredentials: AwsKmsSignerCredentials;
    ethereumAddress: string;
    constructor(kmsCredentials: AwsKmsSignerCredentials, provider?: ethers.providers.Provider);
    getAddress(): Promise<string>;
    _signDigest(digestString: string): Promise<string>;
    signMessage(message: string | ethers.utils.Bytes): Promise<string>;
    signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string>;
    signTransaction(transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>): Promise<string>;
    connect(provider: ethers.providers.Provider): AwsKmsSigner;
}
