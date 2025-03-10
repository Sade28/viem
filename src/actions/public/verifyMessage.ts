import type { Address } from 'abitype'

import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type {
  ByteArray,
  Hex,
  SignableMessage,
  Signature,
} from '../../types/misc.js'
import { hashMessage } from '../../utils/index.js'
import type { HashMessageErrorType } from '../../utils/signature/hashMessage.js'
import {
  type VerifyHashErrorType,
  type VerifyHashParameters,
  verifyHash,
} from './verifyHash.js'

export type VerifyMessageParameters = Omit<VerifyHashParameters, 'hash'> & {
  /** The address that signed the original message. */
  address: Address
  /** The message to be verified. */
  message: SignableMessage
  /** The signature that was generated by signing the message with the address's private key. */
  signature: Hex | ByteArray | Signature
}

export type VerifyMessageReturnType = boolean

export type VerifyMessageErrorType =
  | HashMessageErrorType
  | VerifyHashErrorType
  | ErrorType

/**
 * Verify that a message was signed by the provided address.
 *
 * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyMessage}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyMessageParameters}
 * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
 */
export async function verifyMessage<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, message, signature, ...callRequest }: VerifyMessageParameters,
): Promise<VerifyMessageReturnType> {
  const hash = hashMessage(message)
  return verifyHash(client, {
    address,
    hash,
    signature,
    ...callRequest,
  })
}
