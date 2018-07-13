<?php
/**
 * stage_type.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * stage_type: record
 */
class stage_type extends \cenozo\database\has_rank
{
  /**
   * TODO: document
   */
  public function get_default_next_stage_type()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'stage_type_has_stage_type' );
    $select->add_column( 'next_stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'stage_type_id', '=', $this->id );
    $modifier->limit( 1 );

    $next_stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return is_null( $next_stage_type_id ) ? NULL : new static( $next_stage_type_id );
  }

  /**
   * TODO: document
   */
  public function comes_after( $db_stage_type )
  {
    $select = lib::create( 'database\select' );
    $select->from( 'stage_type_has_stage_type' );
    $select->add_column( 'COUNT(*)', 'total', false );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'next_stage_type_id', '=', $this->id );
    $modifier->where( 'stage_type_id', '=', $db_stage_type->id );
    return 0 < static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
  }

  /**
   * TODO: document
   */
  public function get_review_list( $reqn )
  {
    // accept either a database\reqn object or a reqn ID
    $reqn_id = is_a( $reqn, lib::get_class_name( 'database\reqn' ) ) ? $reqn->id : $reqn;

    $select = lib::create( 'database\select' );
    $select->from( 'review' );
    $select->add_column( 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $modifier->join( 'stage_type', 'review_type.stage_type_id', 'stage_type.id' );
    $modifier->where( 'stage_type.id', '=', $this->id );
    $modifier->where( 'review.reqn_id', '=', $reqn_id );

    $review_list = array();
    foreach( static::db()->get_col( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) ) as $review_id )
      $review_list[] = lib::create( 'database\review', $review_id );
    return $review_list;
  }
}
