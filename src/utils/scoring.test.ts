import { describe, expect, it } from 'vitest'

import { gad7Severity, phq9Severity, triage } from './scoring'

describe('scoring', () => {
  it('phq9Severity boundaries', () => {
    expect(phq9Severity(0)).toBe('minimal')
    expect(phq9Severity(4)).toBe('minimal')
    expect(phq9Severity(5)).toBe('mild')
    expect(phq9Severity(9)).toBe('mild')
    expect(phq9Severity(10)).toBe('moderate')
    expect(phq9Severity(14)).toBe('moderate')
    expect(phq9Severity(15)).toBe('moderately_severe')
    expect(phq9Severity(19)).toBe('moderately_severe')
    expect(phq9Severity(20)).toBe('severe')
  })

  it('gad7Severity boundaries', () => {
    expect(gad7Severity(0)).toBe('minimal')
    expect(gad7Severity(4)).toBe('minimal')
    expect(gad7Severity(5)).toBe('mild')
    expect(gad7Severity(9)).toBe('mild')
    expect(gad7Severity(10)).toBe('moderate')
    expect(gad7Severity(14)).toBe('moderate')
    expect(gad7Severity(15)).toBe('severe')
  })

  it('triage crisis when phq9 item9 >= 2', () => {
    const phq9 = Array(9).fill(0)
    phq9[8] = 2
    const gad7 = Array(7).fill(0)

    const res = triage(phq9, gad7)
    expect(res.level).toBe('crisis')
    expect(res.reasons.length).toBeGreaterThan(0)
  })

  it('triage high when total >= threshold', () => {
    const phq9 = Array(9).fill(3)
    phq9[8] = 0
    const gad7 = Array(7).fill(0)

    const res = triage(phq9, gad7)
    expect(res.level).toBe('high')
  })
})
