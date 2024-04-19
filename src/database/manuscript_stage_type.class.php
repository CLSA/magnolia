<?php
/**
 * manuscript_stage_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * manuscript_stage_type: record
 */
class manuscript_stage_type extends \cenozo\database\has_rank
{
  /**
   * Convenience method
   */
  public function get_next_possible_manuscript_stage_type_object_list()
  {
    $modifier = lib::create( 'database\modifier' );
    $modifier->join(
      'manuscript_stage_type_has_manuscript_stage_type',
      'manuscript_stage_type.id',
      'manuscript_stage_type_has_manuscript_stage_type.next_manuscript_stage_type_id'
    );
    $modifier->where( 'manuscript_stage_type_has_manuscript_stage_type.manuscript_stage_type_id', '=', $this->id );

    return static::select_objects( $modifier );
  }

  /**
   * Convenience method
   */
  public function get_default_next_manuscript_stage_type()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'manuscript_stage_type_has_manuscript_stage_type' );
    $select->add_table_column( 'next_manuscript_stage_type', 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'manuscript_stage_type_id', '=', $this->id );
    $modifier->join(
      'manuscript_stage_type',
      'manuscript_stage_type_has_manuscript_stage_type.next_stage_type_id',
      'next_manuscript_stage_type.id',
      '',
      'next_manuscript_stage_type'
    );
    $modifier->order( 'next_manuscript_stage_type.rank' );
    $modifier->limit( 1 );

    $next_stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return is_null( $next_stage_type_id ) ? NULL : new static( $next_stage_type_id );
  }

  /**
   * Convenience method
   */
  public function get_manuscript_review_object_list( $manuscript )
  {
    // accept either a database\manuscript object or a manuscript ID
    $manuscript_id = is_a( $manuscript, lib::get_class_name( 'database\manuscript' ) ) ?
      $manuscript->id : $manuscript;

    $select = lib::create( 'database\select' );
    $select->from( 'manuscript_review' );
    $select->add_column( 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join(
      'manuscript_review_type',
      'manuscript_review.manuscript_review_type_id',
      'manuscript_review_type.id'
    );
    $modifier->join(
      'manuscript_stage_type',
      'manuscript_review_type.manuscript_stage_type_id',
      'manuscript_stage_type.id'
    );
    $modifier->where( 'manuscript_stage_type.id', '=', $this->id );
    $modifier->where( 'manuscript_review.manuscript_id', '=', $manuscript_id );

    $review_list = array();
    foreach( static::db()->get_col( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) ) as $review_id )
      $review_list[] = lib::create( 'database\manuscript_review', $review_id );
    return $review_list;
  }
}
