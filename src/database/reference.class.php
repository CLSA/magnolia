<?php
/**
 * reference.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reference: record
 */
class reference extends \cenozo\database\has_rank
{
  /**
   * Override the parent method
   */
  public function save()
  {
    $setting_manager = lib::create( 'business\setting_manager' );
    if( $setting_manager->get_setting( 'general', 'max_references_per_reqn' ) < $this->rank )
      throw lib::create( 'exception\argument', 'rank', $this->rank, __METHOD__ );

    parent::save();
  }

  /**
   * The type of record which the record has a rank for.
   * @var string
   * @access protected
   * @static
   */
  protected static $rank_parent = 'reqn';
}
