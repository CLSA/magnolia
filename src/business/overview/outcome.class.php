<?php
/**
 * overview.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\overview;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * overview: outcome
 */
class outcome extends \cenozo\business\overview\base_overview
{
  /**
   * Implements abstract method
   */
  protected function build( $modifier = NULL )
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $review_type_class_name = lib::get_class_name( 'database\review_type' );
    $recommendation_type_class_name = lib::get_class_name( 'database\recommendation_type' );

    $minor_id = $recommendation_type_class_name::get_unique_record( 'name', 'Revise - minor' )->id;
    $major_id = $recommendation_type_class_name::get_unique_record( 'name', 'Revise - major' )->id;
    $not_approved_id = $stage_type_class_name::get_unique_record( 'name', 'Not Approved' )->id;
    $approved_id = $stage_type_class_name::get_unique_record( 'name', 'Agreement' )->id;
    $review_type_list = [
      $review_type_class_name::get_unique_record( 'name', 'EC' )->id,
      $review_type_class_name::get_unique_record( 'name', 'Chair' )->id
    ];
    
    $deadline_list = [];

    // count all reqns which reached the agreement stage, but aren't "not approved"
    $approved_sel = lib::create( 'database\select' );
    $approved_sel->add_table_column( 'deadline', 'name', 'deadline' );
    $approved_sel->add_column(
      'IF( '.
        'minor.id IS NOT NULL, "Revise - minor", '.
        'IF( major.id IS NOT NULL, "Revise - major", "Approved" ) '.
      ')',
      'initial',
      false
    );
    $approved_sel->add_column( 'COUNT( DISTINCT reqn.id )', 'total', false );
    $approved_mod = lib::create( 'database\modifier' );
    $approved_mod->join( 'deadline', 'reqn.deadline_id', 'deadline.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.amendment', '=', '.' );
    $join_mod->where( 'stage.stage_type_id', '=', $approved_id );
    $approved_mod->join_modifier( 'stage', $join_mod );

    // join to any minor recommendatation by a Chair or EC
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'minor.reqn_id', false );
    $join_mod->where( 'minor.amendment', '=', '.' );
    $join_mod->where( 'minor.recommendation_type_id', '=', $minor_id );
    $join_mod->where( 'minor.review_type_id', 'IN', $review_type_list );
    $approved_mod->join_modifier( 'review', $join_mod, 'left', 'minor' );

    // join to any major recommendatation by a Chair or EC
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'major.reqn_id', false );
    $join_mod->where( 'major.amendment', '=', '.' );
    $join_mod->where( 'major.recommendation_type_id', '=', $major_id );
    $join_mod->where( 'major.review_type_id', 'IN', $review_type_list );
    $approved_mod->join_modifier( 'review', $join_mod, 'left', 'major' );

    // make sure none are in the not-approved stage
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'not_approved.reqn_id', false );
    $join_mod->where( 'not_approved.amendment', '=', '.' );
    $join_mod->where( 'not_approved.stage_type_id', '=', $not_approved_id );
    $approved_mod->join_modifier( 'stage', $join_mod, 'left', 'not_approved' );
    $approved_mod->where( 'not_approved.id', '=', NULL );

    $approved_mod->group( 'deadline.id' );
    $approved_mod->group( 'minor.id IS NOT NULL' );
    $approved_mod->group( 'major.id IS NOT NULL' );
    $approved_mod->order( 'deadline.datetime' );

    foreach( $reqn_class_name::select( $approved_sel, $approved_mod ) as $row )
    {
      $deadline = $row['deadline'];
      $initial = $row['initial'];
      $total = $row['total'];
      if( !array_key_exists( $deadline, $deadline_list ) )
      {
        $deadline_list[$deadline] = [
          'initial' => [
            'Approved' => 0,
            'Revise - minor' => 0,
            'Revise - major' => 0,
            'Not Approved' => 0
          ],
          'final' => [
            'Approved' => 0,
            'Not Approved' => 0
          ]
        ];
      }
      $deadline_list[$deadline]['initial'][$initial] += $total;
      $deadline_list[$deadline]['final']['Approved'] += $total;
    }

    // count all reqns which were not approved
    $not_approved_sel = lib::create( 'database\select' );
    $not_approved_sel->add_table_column( 'deadline', 'name', 'deadline' );
    $not_approved_sel->add_column(
      'IF( '.
        'minor.id IS NOT NULL, "Revise - minor", '.
        'IF( major.id IS NOT NULL, "Revise - major", "Not Approved" ) '.
      ')',
      'initial',
      false
    );
    $not_approved_sel->add_column( 'COUNT( DISTINCT reqn.id )', 'total', false );
    $not_approved_mod = lib::create( 'database\modifier' );
    $not_approved_mod->join( 'deadline', 'reqn.deadline_id', 'deadline.id' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
    $join_mod->where( 'stage.amendment', '=', '.' );
    $join_mod->where( 'stage.stage_type_id', '=', $not_approved_id );
    $not_approved_mod->join_modifier( 'stage', $join_mod );
    
    // join to any minor recommendatation by a Chair or EC
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'minor.reqn_id', false );
    $join_mod->where( 'minor.amendment', '=', '.' );
    $join_mod->where( 'minor.recommendation_type_id', '=', $minor_id );
    $join_mod->where( 'minor.review_type_id', 'IN', $review_type_list );
    $not_approved_mod->join_modifier( 'review', $join_mod, 'left', 'minor' );

    // join to any major recommendatation by a Chair or EC
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'reqn.id', '=', 'major.reqn_id', false );
    $join_mod->where( 'major.amendment', '=', '.' );
    $join_mod->where( 'major.recommendation_type_id', '=', $major_id );
    $join_mod->where( 'major.review_type_id', 'IN', $review_type_list );
    $not_approved_mod->join_modifier( 'review', $join_mod, 'left', 'major' );

    $not_approved_mod->group( 'deadline.id' );
    $not_approved_mod->group( 'minor.id IS NOT NULL' );
    $not_approved_mod->group( 'major.id IS NOT NULL' );
    $not_approved_mod->order( 'deadline.datetime' );

    foreach( $reqn_class_name::select( $not_approved_sel, $not_approved_mod ) as $row )
    {
      $deadline = $row['deadline'];
      $initial = $row['initial'];
      $total = $row['total'];
      if( !array_key_exists( $deadline, $deadline_list ) )
      {
        $deadline_list[$deadline] = [
          'initial' => [
            'Approved' => 0,
            'Revise - minor' => 0,
            'Revise - major' => 0,
            'Not Approved' => 0
          ],
          'final' => [
            'Approved' => 0,
            'Not Approved' => 0
          ]
        ];
      }
      $deadline_list[$deadline]['initial'][$initial] += $total;
      $deadline_list[$deadline]['final']['Not Approved'] += $total;
    }

    foreach( $deadline_list as $deadline => $data )
    {
      $root_node = $this->add_root_item( $deadline );

      $node = $this->add_item( $root_node, 'Initial Review' );
      foreach( $data['initial'] as $type => $total ) $this->add_item( $node, $type, $total );
      
      $node = $this->add_item( $root_node, 'FInal Outcome' );
      foreach( $data['final'] as $type => $total ) $this->add_item( $node, $type, $total );
    }
  }
}
