<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\requisition\reference;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function prepare()
  {
    parent::prepare();

    $reference_class_name = lib::get_class_name( 'database\reference' );

    // if the rank isn't set then make it the last
    $db_reference = $this->get_leaf_record();
    if( is_null( $db_reference->rank ) )
    {
      $reference_sel = lib::create( 'database\select' );
      $reference_sel->from( 'reference' );
      $reference_sel->add_column( 'MAX( rank )', 'max', false );
      $reference_mod = lib::create( 'database\modifier' );
      $reference_mod->where( 'requisition_id', '=', $db_reference->requisition_id );
      $db_reference->rank = $reference_class_name::db()->get_one(
        sprintf( '%s %s', $reference_sel->get_sql(), $reference_mod->get_sql() )
      ) + 1;
    }
  }
}
