import { Abi } from 'abitype'
import { AbiErrorSignatureNotFoundError } from '../../errors'
import { Hex } from '../../types'
import { slice } from '../data'
import { getFunctionSignature } from '../hash'
import { decodeAbi } from './decodeAbi'
import { getDefinition } from './getDefinition'

export function decodeErrorResult({ abi, data }: { abi: Abi; data: Hex }) {
  const signature = slice(data, 0, 4)
  const description = abi.find(
    (x) => signature === getFunctionSignature(getDefinition(x)),
  )
  if (!description) throw new AbiErrorSignatureNotFoundError(signature)
  return {
    errorName: (description as { name: string }).name,
    args:
      'inputs' in description &&
      description.inputs &&
      description.inputs.length > 0
        ? decodeAbi({ data: slice(data, 4), params: description.inputs })
        : undefined,
  }
}
