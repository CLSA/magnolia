<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\destruction_report\data_destroy;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Extends parent class
 */
class query extends \cenozo\service\query
{
  /**
   * Extends the parent method
   */
  public function get_leaf_parent_relationship()
  {
    $relationship_class_name = lib::get_class_name( 'database\relationship' );
    return $relationship_class_name::MANY_TO_MANY;
  }

  /**
   * Replaces parent method
   */
  protected function get_record_count()
  {
    // find aliases in the select and translate them in the modifier
    $modifier = clone $this->modifier;
    $this->select->apply_aliases_to_modifier( $modifier );
    return $this->get_parent_record()->get_reqn()->get_data_destroy_count( $modifier );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    // find aliases in the select and translate them in the modifier
    $modifier = clone $this->modifier;
    $this->select->apply_aliases_to_modifier( $modifier );
    return $this->get_parent_record()->get_reqn()->get_data_destroy_list( $this->select, $modifier );
  }
}
