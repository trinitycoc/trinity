import React from 'react'
import { sortMembersByPosition } from '../../utils/cwlUtils'
import { AttackDetails } from './AttackDetails'

/**
 * Component to display war members table
 */
export const WarMembersTable = ({ members, title, sortBy = 'position' }) => {
  if (!members || members.length === 0) return null

  const sortedMembers = sortBy === 'position' 
    ? sortMembersByPosition(members)
    : members

  return (
    <div className="cwl-war-members-section">
      <div className="cwl-subsection-title-small">{title} ({members.length})</div>
      <div className="cwl-table-wrapper">
        <table className="cwl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tag</th>
              <th>TH</th>
              <th>Position</th>
              <th>Attack Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member, idx) => (
              <tr key={idx}>
                <td className="cwl-table-value">{member.name}</td>
                <td className="cwl-table-value">{member.tag}</td>
                <td className="cwl-table-value">TH{member.townHallLevel}</td>
                <td className="cwl-table-value">{member.mapPosition}</td>
                <td className="cwl-table-value">
                  <AttackDetails attacks={member.attacks} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

